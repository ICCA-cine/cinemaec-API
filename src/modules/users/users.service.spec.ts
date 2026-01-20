import { Test, TestingModule } from '@nestjs/testing'
import { getRepositoryToken } from '@nestjs/typeorm'
import { ConflictException, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import * as bcrypt from 'bcrypt'
import { UsersService } from './users.service'
import { User, UserRole } from './entities/user.entity'
import { Profile } from '../profiles/entities/profile.entity'
import { EmailsService } from '../emails/emails.service'
import { NotificationsService } from '../notifications/notifications.service'
import { RegisterDto } from './dto/register.dto'
import { LoginDto } from './dto/login.dto'

describe('UsersService', () => {
  let service: UsersService

  const mockUserQueryBuilder = {
    where: jest.fn().mockReturnThis(),
    addSelect: jest.fn().mockReturnThis(),
    getOne: jest.fn(),
  }

  const mockUsersRepository = {
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    createQueryBuilder: jest.fn(() => mockUserQueryBuilder),
  }

  const mockProfilesRepository = {
    findOne: jest.fn(),
  }

  const mockEmailsService = {
    sendVerificationEmail: jest.fn(),
  }

  const mockNotificationsService = {
    create: jest.fn(),
  }

  const mockJwtService = {
    sign: jest.fn(),
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUsersRepository,
        },
        {
          provide: getRepositoryToken(Profile),
          useValue: mockProfilesRepository,
        },
        {
          provide: EmailsService,
          useValue: mockEmailsService,
        },
        {
          provide: NotificationsService,
          useValue: mockNotificationsService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile()

    service = module.get<UsersService>(UsersService)

    jest.clearAllMocks()
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  describe('register', () => {
    const registerDto: RegisterDto = {
      email: 'test@example.com',
      cedula: '1234567890',
      password: 'Password123',
    }

    it('should register a new user successfully', async () => {
      const hashedPassword = 'hashedPassword123'
      const savedUser = {
        id: 1,
        email: registerDto.email,
        cedula: registerDto.cedula,
        password: hashedPassword,
        role: UserRole.USER,
        isActive: false,
        profileId: null,
        lastLogin: null,
        emailVerificationToken: null,
        passwordResetToken: null,
        passwordResetExpires: null,
        createdAt: new Date(),
      }

      mockUsersRepository.findOne.mockResolvedValueOnce(null) // email no existe
      mockUsersRepository.findOne.mockResolvedValueOnce(null) // cedula no existe
      jest
        .spyOn(bcrypt, 'hash')
        .mockImplementation(() => Promise.resolve(hashedPassword as never))
      mockUsersRepository.create.mockReturnValue(savedUser)
      mockUsersRepository.save.mockResolvedValue(savedUser)

      const result = await service.register(registerDto)

      expect(mockUsersRepository.findOne).toHaveBeenCalledWith({
        where: { email: registerDto.email },
      })
      expect(mockUsersRepository.findOne).toHaveBeenCalledWith({
        where: { cedula: registerDto.cedula },
      })
      expect(bcrypt.hash).toHaveBeenCalledWith(registerDto.password, 10)
      expect(mockUsersRepository.create).toHaveBeenCalled()
      expect(mockUsersRepository.save).toHaveBeenCalled()
      expect(result).toEqual({
        message:
          'Usuario registrado exitosamente. Por favor verifica tu email para activar tu cuenta.',
        userId: savedUser.id,
      })
    })

    it('should throw ConflictException if email already exists', async () => {
      const existingUser = {
        id: 1,
        email: registerDto.email,
      }

      mockUsersRepository.findOne.mockResolvedValueOnce(existingUser)

      await expect(service.register(registerDto)).rejects.toThrow(
        new ConflictException('El email ya está registrado'),
      )

      expect(mockUsersRepository.findOne).toHaveBeenCalledWith({
        where: { email: registerDto.email },
      })
      expect(mockUsersRepository.save).not.toHaveBeenCalled()
      expect(mockEmailsService.sendVerificationEmail).not.toHaveBeenCalled()
    })

    it('should throw ConflictException if cedula already exists', async () => {
      const existingUser = {
        id: 1,
        cedula: registerDto.cedula,
      }

      mockUsersRepository.findOne.mockResolvedValueOnce(null) // email no existe
      mockUsersRepository.findOne.mockResolvedValueOnce(existingUser) // cedula existe

      await expect(service.register(registerDto)).rejects.toThrow(
        new ConflictException('La cédula ya está registrada'),
      )

      expect(mockUsersRepository.findOne).toHaveBeenCalledWith({
        where: { cedula: registerDto.cedula },
      })
      expect(mockUsersRepository.save).not.toHaveBeenCalled()
    })

    it('should hash the password before saving', async () => {
      const hashedPassword = 'hashedPassword123'

      mockUsersRepository.findOne.mockResolvedValue(null)
      jest
        .spyOn(bcrypt, 'hash')
        .mockImplementation(() => Promise.resolve(hashedPassword as never))
      mockUsersRepository.create.mockReturnValue({
        password: hashedPassword,
      } as User)
      mockUsersRepository.save.mockResolvedValue({ id: 1 } as User)

      await service.register(registerDto)

      expect(bcrypt.hash).toHaveBeenCalledWith(registerDto.password, 10)
      expect(mockUsersRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          password: hashedPassword,
        }),
      )
    })
  })

  describe('login', () => {
    const loginDto: LoginDto = {
      email: 'test@example.com',
      password: 'Password123',
    }

    it('should login successfully and return token', async () => {
      const hashedPassword = await bcrypt.hash(loginDto.password, 10)
      const user = {
        id: 1,
        email: loginDto.email,
        cedula: '1234567890',
        password: hashedPassword,
        role: UserRole.USER,
        isActive: true,
        lastLogin: null as Date | null,
        permissions: ['admin_spaces'],
      }

      const accessToken = 'jwt.token.here'
      mockUserQueryBuilder.getOne.mockResolvedValue(user)
      mockProfilesRepository.findOne.mockResolvedValue({ id: 1, userId: 1 })
      jest
        .spyOn(bcrypt, 'compare')
        .mockImplementation(() => Promise.resolve(true as never))
      mockUsersRepository.save.mockResolvedValue(user)
      mockJwtService.sign.mockReturnValue(accessToken)

      const result = await service.login(loginDto)

      expect(mockUsersRepository.createQueryBuilder).toHaveBeenCalledWith(
        'user',
      )
      expect(mockUserQueryBuilder.where).toHaveBeenCalledWith(
        'user.email = :email',
        { email: loginDto.email },
      )
      expect(mockProfilesRepository.findOne).toHaveBeenCalledWith({
        where: { userId: user.id },
      })
      expect(bcrypt.compare).toHaveBeenCalledWith(
        loginDto.password,
        user.password,
      )
      expect(mockUsersRepository.save).toHaveBeenCalled()
      expect(mockJwtService.sign).toHaveBeenCalledWith({
        sub: user.id,
        email: user.email,
        cedula: user.cedula,
        role: user.role,
      })
      expect(result).toEqual({
        accessToken,
        user: {
          id: user.id,
          email: user.email,
          cedula: user.cedula,
          role: user.role,
          is_active: user.isActive,
          has_profile: true,
          permissions: ['admin_spaces'],
        },
      })
    })

    it('should throw UnauthorizedException if user not found', async () => {
      mockUserQueryBuilder.getOne.mockResolvedValue(null)

      await expect(service.login(loginDto)).rejects.toThrow(
        new UnauthorizedException('Credenciales incorrectas'),
      )

      expect(mockUsersRepository.createQueryBuilder).toHaveBeenCalledWith(
        'user',
      )
      expect(mockJwtService.sign).not.toHaveBeenCalled()
    })

    it('should throw UnauthorizedException if account is not active', async () => {
      const user = {
        id: 1,
        email: loginDto.email,
        cedula: '1234567890',
        password: 'hashedPassword',
        role: UserRole.USER,
        isActive: false,
        permissions: null,
      }

      mockUserQueryBuilder.getOne.mockResolvedValue(user)

      await expect(service.login(loginDto)).rejects.toThrow(
        new UnauthorizedException(
          'Tu cuenta no está activa. Contacta al administrador.',
        ),
      )

      expect(mockJwtService.sign).not.toHaveBeenCalled()
    })

    it('should throw UnauthorizedException if password is incorrect', async () => {
      const user = {
        id: 1,
        email: loginDto.email,
        cedula: '1234567890',
        password: 'hashedPassword',
        role: UserRole.USER,
        isActive: true,
        permissions: null,
      }

      mockUserQueryBuilder.getOne.mockResolvedValue(user)
      jest
        .spyOn(bcrypt, 'compare')
        .mockImplementation(() => Promise.resolve(false as never))

      await expect(service.login(loginDto)).rejects.toThrow(
        new UnauthorizedException('Credenciales incorrectas'),
      )

      expect(bcrypt.compare).toHaveBeenCalledWith(
        loginDto.password,
        user.password,
      )
      expect(mockJwtService.sign).not.toHaveBeenCalled()
    })

    it('should update lastLogin timestamp', async () => {
      const hashedPassword = await bcrypt.hash(loginDto.password, 10)
      const user = {
        id: 1,
        email: loginDto.email,
        cedula: '1234567890',
        password: hashedPassword,
        role: UserRole.USER,
        isActive: true,
        lastLogin: null as Date | null,
        permissions: null,
      }

      mockUserQueryBuilder.getOne.mockResolvedValue(user)
      mockProfilesRepository.findOne.mockResolvedValue(null)
      jest
        .spyOn(bcrypt, 'compare')
        .mockImplementation(() => Promise.resolve(true as never))
      mockUsersRepository.save.mockResolvedValue(user)
      mockJwtService.sign.mockReturnValue('token')

      await service.login(loginDto)

      expect(mockUsersRepository.save).toHaveBeenCalled()
      expect(user.lastLogin).toBeInstanceOf(Date)
    })
  })

  describe('getProfile', () => {
    const userId = 1

    it('should return user profile with has_uploaded_agreement true', async () => {
      const user = {
        id: userId,
        email: 'test@example.com',
        cedula: '1234567890',
        role: UserRole.USER,
        isActive: true,
        lastLogin: new Date(),
      }

      const profile = {
        id: 1,
        userId,
        hasUploadedAgreement: true,
      }

      mockUsersRepository.findOne.mockResolvedValue(user)
      mockProfilesRepository.findOne.mockResolvedValue(profile)

      const result = await service.getProfile(userId)

      expect(mockUsersRepository.findOne).toHaveBeenCalledWith({
        where: { id: userId },
      })
      expect(mockProfilesRepository.findOne).toHaveBeenCalledWith({
        where: { userId: user.id },
        select: ['id', 'hasUploadedAgreement'],
      })
      expect(result).toEqual({
        id: user.id,
        email: user.email,
        cedula: user.cedula,
        role: user.role,
        is_active: user.isActive,
        has_profile: true,
        has_uploaded_agreement: true,
        last_login: user.lastLogin,
      })
    })

    it('should return has_uploaded_agreement false when profile has no agreement', async () => {
      const user = {
        id: userId,
        email: 'test@example.com',
        cedula: '1234567890',
        role: UserRole.USER,
        isActive: true,
        lastLogin: new Date(),
      }

      const profile = {
        id: 1,
        userId,
        hasUploadedAgreement: false,
      }

      mockUsersRepository.findOne.mockResolvedValue(user)
      mockProfilesRepository.findOne.mockResolvedValue(profile)

      const result = await service.getProfile(userId)

      expect(result.has_uploaded_agreement).toBe(false)
    })

    it('should return has_uploaded_agreement false when no profile exists', async () => {
      const user = {
        id: userId,
        email: 'test@example.com',
        cedula: '1234567890',
        role: UserRole.USER,
        isActive: true,
        lastLogin: new Date(),
      }

      mockUsersRepository.findOne.mockResolvedValue(user)
      mockProfilesRepository.findOne.mockResolvedValue(null)

      const result = await service.getProfile(userId)

      expect(result.has_profile).toBe(false)
      expect(result.has_uploaded_agreement).toBe(false)
    })

    it('should throw UnauthorizedException if user not found', async () => {
      mockUsersRepository.findOne.mockResolvedValue(null)

      await expect(service.getProfile(userId)).rejects.toThrow(
        new UnauthorizedException('Usuario no encontrado'),
      )
    })

    it('should throw UnauthorizedException if user is not active', async () => {
      const user = {
        id: userId,
        email: 'test@example.com',
        cedula: '1234567890',
        role: UserRole.USER,
        isActive: false,
        lastLogin: new Date(),
      }

      mockUsersRepository.findOne.mockResolvedValue(user)

      await expect(service.getProfile(userId)).rejects.toThrow(
        new UnauthorizedException('Tu cuenta ha sido desactivada'),
      )
    })
  })
})
