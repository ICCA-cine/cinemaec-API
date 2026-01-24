import { ApiProperty } from '@nestjs/swagger'

/**
 * DTO de respuesta de login
 */
export class LoginResponseDto {
  @ApiProperty()
  accessToken: string

  @ApiProperty()
  user: UserBasicInfoDto
}

/**
 * DTO con información básica del usuario (para respuestas de login)
 */
export class UserBasicInfoDto {
  @ApiProperty()
  id: number

  @ApiProperty()
  email: string

  @ApiProperty()
  cedula: string

  @ApiProperty()
  role: string

  @ApiProperty()
  isActive: boolean

  @ApiProperty()
  hasProfile: boolean

  @ApiProperty({ type: [String], nullable: true })
  permissions: string[] | null
}

/**
 * DTO de perfil de usuario (para GET /users/me)
 */
export class UserProfileResponseDto {
  @ApiProperty()
  id: number

  @ApiProperty()
  email: string

  @ApiProperty()
  cedula: string

  @ApiProperty()
  role: string

  @ApiProperty()
  isActive: boolean

  @ApiProperty()
  hasProfile: boolean

  @ApiProperty()
  hasUploadedAgreement: boolean

  @ApiProperty({ nullable: true })
  lastLogin: Date | null

  @ApiProperty({ type: [String], nullable: true })
  permissions: string[] | null
}

/**
 * DTO de información completa del usuario (para admins)
 */
export class UserDetailResponseDto {
  @ApiProperty()
  id: number

  @ApiProperty()
  email: string

  @ApiProperty()
  cedula: string

  @ApiProperty()
  role: string

  @ApiProperty()
  isActive: boolean

  @ApiProperty({ nullable: true })
  profileId: number | null

  @ApiProperty({ type: [String], nullable: true })
  permissions: string[] | null

  @ApiProperty()
  createdAt: Date

  @ApiProperty({ nullable: true })
  lastLogin: Date | null
}
