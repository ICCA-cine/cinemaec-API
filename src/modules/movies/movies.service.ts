import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { In, Repository } from 'typeorm'
import { Movie } from './entities/movie.entity'
import { MovieStatusEnum } from './entities/movie.entity'
import { MovieProfessional } from './entities/movie-professional.entity'
import { UpdateMovieCastCrewDto } from './dto/update-cast-crew.dto'
import { CinematicRole } from '../catalog/entities/cinematic-role.entity'
import { MovieCompany, CompanyParticipationType } from './entities/movie-company.entity'
import { MovieInternationalCoproduction } from './entities/movie-international-coproduction.entity'
import { MovieFilmingCountry } from './entities/movie-filming-country.entity'
import { MovieFunding } from './entities/movie-funding.entity'
import { MovieNationalRelease } from './entities/movie-national-release.entity'
import { MovieInternationalRelease } from './entities/movie-international-release.entity'
import { MovieFestivalNomination } from './entities/movie-festival-nomination.entity'
import { MoviePlatform } from './entities/movie-platform.entity'
import { MovieContact } from './entities/movie-contact.entity'
import { MovieContentBank } from './entities/movie-content-bank.entity'
import { MovieSubtitle } from './entities/movie-subtitle.entity'
import {
  MovieClaimRequest,
  MovieClaimRequestStatus,
} from './entities/movie-claim-request.entity'
import { CreateMovieDto } from './dto/create-movie.dto'
import { SubGenre } from '../catalog/entities/subgenre.entity'
import { Language } from '../catalog/entities/language.entity'
import { Asset } from '../assets/entities/asset.entity'
import { City } from '../catalog/entities/city.entity'
import { Country } from '../catalog/entities/country.entity'
import {
  NotificationTypeEnum,
} from '../notifications/entities/notification.entity'
import { NotificationsService } from '../notifications/notifications.service'
import { PermissionEnum, User, UserRole } from '../users/entities/user.entity'

@Injectable()
export class MoviesService {
  private static readonly DIRECTOR_ROLE_ID = 1
  private static readonly PRODUCER_ROLE_ID = 2
  private static readonly ACTOR_ROLE_ID = 20
  private readonly logger = new Logger(MoviesService.name)

  constructor(
    @InjectRepository(Movie)
    private readonly movieRepository: Repository<Movie>,
    @InjectRepository(MovieProfessional)
    private readonly movieProfessionalRepository: Repository<MovieProfessional>,
    @InjectRepository(CinematicRole)
    private readonly cinematicRoleRepository: Repository<CinematicRole>,
    @InjectRepository(MovieCompany)
    private readonly movieCompanyRepository: Repository<MovieCompany>,
    @InjectRepository(MovieInternationalCoproduction)
    private readonly movieInternationalCoproductionRepository: Repository<MovieInternationalCoproduction>,
    @InjectRepository(MovieFilmingCountry)
    private readonly movieFilmingCountryRepository: Repository<MovieFilmingCountry>,
    @InjectRepository(MovieFunding)
    private readonly movieFundingRepository: Repository<MovieFunding>,
    @InjectRepository(MovieNationalRelease)
    private readonly movieNationalReleaseRepository: Repository<MovieNationalRelease>,
    @InjectRepository(MovieInternationalRelease)
    private readonly movieInternationalReleaseRepository: Repository<MovieInternationalRelease>,
    @InjectRepository(MovieFestivalNomination)
    private readonly movieFestivalNominationRepository: Repository<MovieFestivalNomination>,
    @InjectRepository(MoviePlatform)
    private readonly moviePlatformRepository: Repository<MoviePlatform>,
    @InjectRepository(MovieContact)
    private readonly movieContactRepository: Repository<MovieContact>,
    @InjectRepository(MovieContentBank)
    private readonly movieContentBankRepository: Repository<MovieContentBank>,
    @InjectRepository(MovieSubtitle)
    private readonly movieSubtitleRepository: Repository<MovieSubtitle>,
    @InjectRepository(MovieClaimRequest)
    private readonly movieClaimRequestRepository: Repository<MovieClaimRequest>,
    @InjectRepository(SubGenre)
    private readonly subGenreRepository: Repository<SubGenre>,
    @InjectRepository(Language)
    private readonly languageRepository: Repository<Language>,
    @InjectRepository(City)
    private readonly cityRepository: Repository<City>,
    @InjectRepository(Country)
    private readonly countryRepository: Repository<Country>,
    @InjectRepository(Asset)
    private readonly assetRepository: Repository<Asset>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly notificationsService: NotificationsService,
  ) {}

  async findClaimRequestsForAdmin(adminUserId?: number) {
    if (!adminUserId) {
      throw new ForbiddenException('Usuario administrador inválido')
    }

    const adminUser = await this.userRepository.findOne({
      where: { id: adminUserId },
      select: ['id', 'role', 'permissions'],
    })

    const hasAdminMoviesPermission =
      adminUser?.permissions?.includes(PermissionEnum.ADMIN_MOVIES) ?? false

    if (!adminUser || adminUser.role !== UserRole.ADMIN || !hasAdminMoviesPermission) {
      throw new ForbiddenException(
        'No tienes permisos para consultar solicitudes de películas',
      )
    }

    const claimRequests = await this.movieClaimRequestRepository.find({
      relations: [
        'movie',
        'claimantUser',
        'supportDocumentAsset',
        'reviewedByUser',
      ],
      order: { createdAt: 'DESC' },
    })

    return claimRequests.map((claimRequest) => ({
      id: claimRequest.id,
      status: claimRequest.status,
      observation: claimRequest.observation,
      createdAt: claimRequest.createdAt,
      updatedAt: claimRequest.updatedAt,
      reviewedAt: claimRequest.reviewedAt,
      reviewedByUserId: claimRequest.reviewedByUserId,
      reviewedByUser: claimRequest.reviewedByUser
        ? {
            id: claimRequest.reviewedByUser.id,
            email: claimRequest.reviewedByUser.email,
          }
        : null,
      movie: {
        id: claimRequest.movie.id,
        title: claimRequest.movie.title,
        titleEn: claimRequest.movie.titleEn,
        releaseYear: claimRequest.movie.releaseYear,
        type: claimRequest.movie.type,
        genre: claimRequest.movie.genre,
        status: claimRequest.movie.status,
        ownerId: claimRequest.movie.ownerId,
      },
      claimant: {
        id: claimRequest.claimantUser.id,
        email: claimRequest.claimantUser.email,
        cedula: claimRequest.claimantUser.cedula,
      },
      supportDocument: {
        id: claimRequest.supportDocumentAsset.id,
        url: claimRequest.supportDocumentAsset.url,
        documentType: claimRequest.supportDocumentAsset.documentType,
        ownerType: claimRequest.supportDocumentAsset.ownerType,
        createdAt: claimRequest.supportDocumentAsset.createdAt,
      },
    }))
  }

  async findClaimRequestsForUser(userId?: number) {
    if (!userId) {
      throw new ForbiddenException('Usuario inválido')
    }

    const claimRequests = await this.movieClaimRequestRepository.find({
      where: { claimantUserId: userId },
      relations: ['movie', 'supportDocumentAsset', 'reviewedByUser'],
      order: { createdAt: 'DESC' },
    })

    return claimRequests.map((claimRequest) => ({
      id: claimRequest.id,
      status: claimRequest.status,
      observation: claimRequest.observation,
      createdAt: claimRequest.createdAt,
      updatedAt: claimRequest.updatedAt,
      reviewedAt: claimRequest.reviewedAt,
      reviewedByUserId: claimRequest.reviewedByUserId,
      reviewedByUser: claimRequest.reviewedByUser
        ? {
            id: claimRequest.reviewedByUser.id,
            email: claimRequest.reviewedByUser.email,
          }
        : null,
      movie: {
        id: claimRequest.movie.id,
        title: claimRequest.movie.title,
        titleEn: claimRequest.movie.titleEn,
        releaseYear: claimRequest.movie.releaseYear,
        type: claimRequest.movie.type,
        genre: claimRequest.movie.genre,
        status: claimRequest.movie.status,
        ownerId: claimRequest.movie.ownerId,
      },
      supportDocument: {
        id: claimRequest.supportDocumentAsset.id,
        url: claimRequest.supportDocumentAsset.url,
        documentType: claimRequest.supportDocumentAsset.documentType,
        ownerType: claimRequest.supportDocumentAsset.ownerType,
        createdAt: claimRequest.supportDocumentAsset.createdAt,
      },
    }))
  }

  async reviewClaimRequest(
    claimRequestId: number,
    status: MovieClaimRequestStatus,
    adminUserId?: number,
    observation?: string,
  ) {
    if (
      status !== MovieClaimRequestStatus.APPROVED &&
      status !== MovieClaimRequestStatus.REJECTED
    ) {
      throw new BadRequestException('El estado debe ser approved o rejected')
    }

    const normalizedObservation = observation?.trim() || ''

    if (status === MovieClaimRequestStatus.REJECTED && !normalizedObservation) {
      throw new BadRequestException(
        'Debes ingresar una observación para rechazar la solicitud',
      )
    }

    if (!adminUserId) {
      throw new ForbiddenException('Usuario administrador inválido')
    }

    const adminUser = await this.userRepository.findOne({
      where: { id: adminUserId },
      select: ['id', 'role', 'permissions'],
    })

    const hasAdminMoviesPermission =
      adminUser?.permissions?.includes(PermissionEnum.ADMIN_MOVIES) ?? false

    if (!adminUser || adminUser.role !== UserRole.ADMIN || !hasAdminMoviesPermission) {
      throw new ForbiddenException(
        'No tienes permisos para revisar solicitudes de películas',
      )
    }

    const claimRequest = await this.movieClaimRequestRepository.findOne({
      where: { id: claimRequestId },
      relations: ['movie', 'claimantUser'],
    })

    if (!claimRequest) {
      throw new NotFoundException(
        `Solicitud de reclamo con ID ${claimRequestId} no encontrada`,
      )
    }

    if (claimRequest.status !== MovieClaimRequestStatus.PENDING) {
      throw new BadRequestException(
        'Solo se pueden revisar solicitudes en estado pending',
      )
    }

    claimRequest.status = status
    claimRequest.observation = normalizedObservation || null
    claimRequest.reviewedByUserId = adminUserId
    claimRequest.reviewedAt = new Date()

    if (status === MovieClaimRequestStatus.APPROVED) {
      claimRequest.movie.ownerId = claimRequest.claimantUserId
      claimRequest.movie.status = MovieStatusEnum.APPROVED
      await this.movieRepository.save(claimRequest.movie)
    }

    const updatedClaimRequest = await this.movieClaimRequestRepository.save(
      claimRequest,
    )

    const decisionLabel =
      status === MovieClaimRequestStatus.APPROVED ? 'aprobada' : 'rechazada'
    const movieTitle = claimRequest.movie.title?.trim() || `ID ${claimRequest.movieId}`

    await this.notificationsService.create({
      userId: claimRequest.claimantUserId,
      title: `Solicitud ${decisionLabel}`,
      message:
        status === MovieClaimRequestStatus.REJECTED
          ? `Tu solicitud para gestionar la película "${movieTitle}" fue rechazada. Comentario del administrador: ${normalizedObservation}`
          : `Tu solicitud para gestionar la película "${movieTitle}" fue aprobada.${
              claimRequest.observation
                ? ` Observación: ${claimRequest.observation}`
                : ''
            }`,
      type:
        status === MovieClaimRequestStatus.APPROVED
          ? NotificationTypeEnum.SUCCESS
          : NotificationTypeEnum.WARNING,
      link: '/movies-management',
      referenceType: 'movie_claim_request',
      referenceId: updatedClaimRequest.id,
    })

    return {
      id: updatedClaimRequest.id,
      status: updatedClaimRequest.status,
      observation: updatedClaimRequest.observation,
      reviewedByUserId: updatedClaimRequest.reviewedByUserId,
      reviewedAt: updatedClaimRequest.reviewedAt,
      updatedAt: updatedClaimRequest.updatedAt,
    }
  }

  // Placeholder for future movie creation logic
  async findAll(): Promise<Movie[]> {
    return this.movieRepository.find({
      relations: ['languages', 'country', 'cities'],
    })
  }

  async createClaimRequest(
    movieId: number,
    claimantUserId?: number,
    supportDocumentAssetId?: number,
  ): Promise<MovieClaimRequest> {
    if (!claimantUserId) {
      throw new BadRequestException('Usuario solicitante inválido')
    }

    if (!supportDocumentAssetId) {
      throw new BadRequestException('Documento de respaldo requerido')
    }

    const movie = await this.movieRepository.findOne({
      where: { id: movieId },
      select: ['id', 'title'],
    })

    if (!movie) {
      throw new NotFoundException(`Movie with ID ${movieId} not found`)
    }

    const assetExists = await this.assetRepository.exists({
      where: { id: supportDocumentAssetId },
    })
    if (!assetExists) {
      throw new NotFoundException(
        `Asset with ID ${supportDocumentAssetId} not found`,
      )
    }

    const existingPendingRequest = await this.movieClaimRequestRepository.findOne({
      where: {
        movieId,
        claimantUserId,
        status: MovieClaimRequestStatus.PENDING,
      },
    })

    if (existingPendingRequest) {
      throw new BadRequestException(
        'Ya existe una solicitud pendiente para esta película',
      )
    }

    const claimRequest = this.movieClaimRequestRepository.create({
      movieId,
      claimantUserId,
      supportDocumentAssetId,
      status: MovieClaimRequestStatus.PENDING,
    })

    const savedClaimRequest = await this.movieClaimRequestRepository.save(claimRequest)

    try {
      const movieTitle = movie.title?.trim() || `ID ${movie.id}`

      await this.notificationsService.create({
        userId: claimantUserId,
        title: 'Solicitud de reclamo enviada',
        message: `Tu solicitud para gestionar la película "${movieTitle}" fue enviada y está pendiente de revisión.`,
        type: NotificationTypeEnum.SUCCESS,
        link: '/movies-management',
        referenceType: 'movie_claim_request',
        referenceId: savedClaimRequest.id,
      })

      await this.notificationsService.notifyAdminsByPermission(
        PermissionEnum.ADMIN_MOVIES,
        'Nueva solicitud de reclamo de película',
        `Se recibió una solicitud de reclamo para la película "${movieTitle}".`,
        NotificationTypeEnum.INFO,
        '/admin/movies-management',
        'movie_claim_request',
        savedClaimRequest.id,
      )
    } catch (error) {
      this.logger.warn(
        `No se pudieron crear notificaciones para la solicitud de reclamo ${savedClaimRequest.id}: ${
          error instanceof Error ? error.message : 'Error desconocido'
        }`,
      )
    }

    return savedClaimRequest
  }

  async findOne(id: number): Promise<Movie> {
    const movie = await this.movieRepository.findOne({
      where: { id },
      relations: [
        'subgenres',
        'languages',
        'subtitles',
        'subtitles.language',
        'country',
        'cities',
        'frameAssets',
        'posterAsset',
        'dossierAsset',
        'dossierAssetEn',
        'pedagogicalSheetAsset',
        'professionals',
        'professionals.professional',
        'professionals.cinematicRole',
        'companies',
        'companies.company',
        'internationalCoproductions',
        'internationalCoproductions.country',
        'filmingCountries',
        'filmingCountries.country',
        'funding',
        'funding.fund',
        'nationalReleases',
        'nationalReleases.exhibitionSpace',
        'nationalReleases.city',
        'internationalReleases',
        'internationalReleases.country',
        'festivalNominations',
        'festivalNominations.fund',
        'platforms',
        'platforms.platform',
        'contacts',
        'contentBank',
      ],
    })

    if (!movie) {
      throw new NotFoundException(`Movie with ID ${id} not found`)
    }

    return movie
  }

  async updateStatus(
    id: number,
    status: MovieStatusEnum,
    requesterUserId?: number,
  ): Promise<Movie> {
    if (!requesterUserId) {
      throw new ForbiddenException('Usuario inválido')
    }

    const requester = await this.userRepository.findOne({
      where: { id: requesterUserId },
      select: ['id', 'role'],
    })

    if (!requester) {
      throw new ForbiddenException('Usuario inválido')
    }

    const movie = await this.movieRepository.findOne({
      where: { id },
      relations: ['languages', 'country', 'cities'],
    })

    if (!movie) {
      throw new NotFoundException(`Movie with ID ${id} not found`)
    }

    const isAdmin = requester.role === UserRole.ADMIN
    if (!isAdmin && movie.ownerId !== requesterUserId) {
      throw new ForbiddenException(
        'No tienes permisos para actualizar el estado de esta película',
      )
    }

    movie.status = status
    return this.movieRepository.save(movie)
  }

  async create(createMovieDto: CreateMovieDto, userId?: number): Promise<Movie> {
    if (!userId) {
      throw new NotFoundException('Usuario creador no encontrado')
    }
    const directorRoleId = createMovieDto.directors?.length
      ? MoviesService.DIRECTOR_ROLE_ID
      : null
    const producerRoleId = createMovieDto.producers?.length
      ? MoviesService.PRODUCER_ROLE_ID
      : null
    const actorRoleId = createMovieDto.mainActors?.length
      ? MoviesService.ACTOR_ROLE_ID
      : null

    const posterAsset = await this.findAssetOrThrow(createMovieDto.posterAssetId)
    const dossierAsset = await this.findAssetOrThrow(createMovieDto.dossierAssetId)
    const dossierAssetEn = await this.findAssetOrThrow(
      createMovieDto.dossierEnAssetId,
    )
    const pedagogicalSheetAsset = await this.findAssetOrThrow(
      createMovieDto.pedagogicalGuideAssetId,
    )
    const frameAssets = await this.findAssetsByIds(
      createMovieDto.stillAssetIds,
    )

    const subgenres = createMovieDto.subGenreIds?.length
      ? await this.subGenreRepository.findBy({
          id: In(createMovieDto.subGenreIds),
        })
      : []

    const filmingCities = createMovieDto.filmingCitiesEc?.length
      ? await this.findCitiesByNames(createMovieDto.filmingCitiesEc)
      : []

    const languages = createMovieDto.languages?.length
      ? await this.languageRepository.findBy({
          code: In(createMovieDto.languages),
        })
      : []

    const subtitleLanguages = createMovieDto.subtitleLanguageIds?.length
      ? await this.languageRepository.findBy({
          id: In(createMovieDto.subtitleLanguageIds),
        })
      : []

    const movie = this.movieRepository.create({
      title: createMovieDto.title,
      titleEn: createMovieDto.titleEn ?? null,
      durationMinutes: createMovieDto.durationMinutes,
      type: createMovieDto.type,
      genre: createMovieDto.genre,
      releaseYear: createMovieDto.releaseYear,
      country: { id: createMovieDto.countryId } as Movie['country'],
      synopsis: createMovieDto.synopsis,
      synopsisEn: createMovieDto.synopsisEn ?? null,
      logline: createMovieDto.logLine ?? null,
      loglineEn: createMovieDto.logLineEn ?? null,
      classification: createMovieDto.classification,
      projectStatus: createMovieDto.projectStatus,
      status: MovieStatusEnum.APPROVED,
      isActive: false,
      projectNeed: createMovieDto.projectNeed ?? null,
      projectNeedEn: createMovieDto.projectNeedEn ?? null,
      createdBy: { id: userId } as Movie['createdBy'],
      ownerId: userId,
      subgenres,
      languages,
      cities: filmingCities,
      posterAsset,
      dossierAsset,
      dossierAssetEn,
      pedagogicalSheetAsset,
      trailerLink: createMovieDto.trailerLink?.trim() || null,
      makingOfLink: createMovieDto.makingOfLink?.trim() || null,
      frameAssets,
      crewTotal: createMovieDto.crewTotal ?? null,
      actorsTotal: createMovieDto.actorsTotal ?? null,
      totalBudget:
        createMovieDto.totalBudget !== undefined
          ? String(createMovieDto.totalBudget)
          : null,
      economicRecovery:
        createMovieDto.economicRecovery !== undefined
          ? String(createMovieDto.economicRecovery)
          : null,
      spectatorsCount:
        createMovieDto.totalAudience ?? null,
    })

    const savedMovie = await this.movieRepository.save(movie)

    const companyRows: MovieCompany[] = []

    if (createMovieDto.producerCompanyId) {
      companyRows.push(
        this.movieCompanyRepository.create({
          movieId: savedMovie.id,
          companyId: createMovieDto.producerCompanyId,
          participation: CompanyParticipationType.PRODUCER,
        }),
      )
    }

    if (createMovieDto.coProducerCompanyIds?.length) {
      createMovieDto.coProducerCompanyIds.forEach((companyId) => {
        companyRows.push(
          this.movieCompanyRepository.create({
            movieId: savedMovie.id,
            companyId,
            participation: CompanyParticipationType.CO_PRODUCER,
          }),
        )
      })
    }

    if (companyRows.length) {
      await this.movieCompanyRepository.save(companyRows)
    }

    if (createMovieDto.internationalCoproductions?.length) {
      const coproductionRows = createMovieDto.internationalCoproductions.map(
        (entry) =>
          this.movieInternationalCoproductionRepository.create({
            movieId: savedMovie.id,
            companyName: entry.companyName,
            countryId: entry.countryId,
          }),
      )
      await this.movieInternationalCoproductionRepository.save(coproductionRows)
    }

    if (createMovieDto.filmingCountries?.length) {
      const countries = await this.findCountriesByCodes(
        createMovieDto.filmingCountries,
      )
      const filmingRows = countries.map((country) =>
        this.movieFilmingCountryRepository.create({
          movieId: savedMovie.id,
          countryId: country.id,
        }),
      )
      if (filmingRows.length) {
        await this.movieFilmingCountryRepository.save(filmingRows)
      }
    }

    if (createMovieDto.funding?.length) {
      const fundingRows = createMovieDto.funding.map((entry) =>
        this.movieFundingRepository.create({
          movieId: savedMovie.id,
          fundId: entry.fundId,
          year: entry.year,
          amountGranted: entry.amountGranted ?? undefined,
          fundingStage: entry.fundingStage,
        }),
      )
      await this.movieFundingRepository.save(fundingRows)
    }

    if (createMovieDto.nationalReleases?.length) {
      const nationalRows = createMovieDto.nationalReleases.map((entry) =>
        this.movieNationalReleaseRepository.create({
          movieId: savedMovie.id,
          exhibitionSpaceId: entry.exhibitionSpaceId,
          cityId: entry.cityId,
          year: entry.year,
          type: entry.type,
        }),
      )
      await this.movieNationalReleaseRepository.save(nationalRows)
    }

    if (createMovieDto.internationalReleases?.length) {
      const internationalRows = createMovieDto.internationalReleases.map(
        (entry) =>
          this.movieInternationalReleaseRepository.create({
            movieId: savedMovie.id,
            countryId: entry.countryId,
            year: entry.year,
            type: entry.type,
            spaceName: entry.spaceName?.trim() || null,
          }),
      )
      await this.movieInternationalReleaseRepository.save(internationalRows)
    }

    if (createMovieDto.festivalNominations?.length) {
      const festivalRows = createMovieDto.festivalNominations.map((entry) =>
        this.movieFestivalNominationRepository.create({
          movieId: savedMovie.id,
          fundId: entry.fundId,
          year: entry.year,
          category: entry.category.trim(),
          result: entry.result,
        }),
      )
      await this.movieFestivalNominationRepository.save(festivalRows)
    }

    if (createMovieDto.platforms?.length) {
      const platformRows = createMovieDto.platforms.map((entry) =>
        this.moviePlatformRepository.create({
          movieId: savedMovie.id,
          platformId: entry.platformId,
          link: entry.link?.trim() || null,
        }),
      )
      await this.moviePlatformRepository.save(platformRows)
    }

    if (createMovieDto.contacts?.length) {
      const contactRows = createMovieDto.contacts.map((entry) =>
        this.movieContactRepository.create({
          movieId: savedMovie.id,
          name: entry.name.trim(),
          role: entry.role,
          phone: entry.phone?.trim() || null,
          email: entry.email?.trim() || null,
        }),
      )
      await this.movieContactRepository.save(contactRows)
    }

    if (createMovieDto.contentBank?.length) {
      const contentRows = createMovieDto.contentBank.map((entry) =>
        this.movieContentBankRepository.create({
          movieId: savedMovie.id,
          exhibitionWindow: entry.exhibitionWindow,
          licensingStartDate: new Date(entry.licensingStartDate),
          licensingEndDate: new Date(entry.licensingEndDate),
          geolocationRestrictionCountryIds:
            entry.geolocationRestrictionCountryIds?.length
              ? entry.geolocationRestrictionCountryIds
              : null,
        }),
      )
      await this.movieContentBankRepository.save(contentRows)
    }

    if (subtitleLanguages.length) {
      const subtitleRows = subtitleLanguages.map((language) =>
        this.movieSubtitleRepository.create({
          movieId: savedMovie.id,
          languageId: language.id,
        }),
      )
      await this.movieSubtitleRepository.save(subtitleRows)
    }

    const professionalRows: MovieProfessional[] = []
    const addedKeys = new Set<string>()

    const addProfessional = (professionalId: number, roleId: number | null) => {
      if (!roleId) return
      const key = `${professionalId}-${roleId}`
      if (addedKeys.has(key)) return
      addedKeys.add(key)
      professionalRows.push(
        this.movieProfessionalRepository.create({
          movieId: savedMovie.id,
          professionalId,
          cinematicRoleId: roleId,
          accredited: true,
        }),
      )
    }

    createMovieDto.directors?.forEach((professionalId) =>
      addProfessional(professionalId, directorRoleId),
    )

    createMovieDto.producers?.forEach((professionalId) =>
      addProfessional(professionalId, producerRoleId),
    )

    createMovieDto.mainActors?.forEach((professionalId) =>
      addProfessional(professionalId, actorRoleId),
    )

    createMovieDto.crew?.forEach((entry) =>
      addProfessional(entry.professionalId, entry.cinematicRoleId),
    )

    if (professionalRows.length) {
      await this.movieProfessionalRepository.save(professionalRows)
    }

    return this.findOne(savedMovie.id)
  }

  async update(
    id: number,
    updateMovieDto: CreateMovieDto,
    userId?: number,
  ): Promise<Movie> {
    if (!userId) {
      throw new NotFoundException('Usuario creador no encontrado')
    }

    const existingMovie = await this.movieRepository.findOne({
      where: { id },
      relations: ['createdBy'],
    })

    if (!existingMovie) {
      throw new NotFoundException(`Movie with ID ${id} not found`)
    }

    const directorRoleId = updateMovieDto.directors?.length
      ? MoviesService.DIRECTOR_ROLE_ID
      : null
    const producerRoleId = updateMovieDto.producers?.length
      ? MoviesService.PRODUCER_ROLE_ID
      : null
    const actorRoleId = updateMovieDto.mainActors?.length
      ? MoviesService.ACTOR_ROLE_ID
      : null

    const posterAsset = await this.findAssetOrThrow(updateMovieDto.posterAssetId)
    const dossierAsset = await this.findAssetOrThrow(updateMovieDto.dossierAssetId)
    const dossierAssetEn = await this.findAssetOrThrow(
      updateMovieDto.dossierEnAssetId,
    )
    const pedagogicalSheetAsset = await this.findAssetOrThrow(
      updateMovieDto.pedagogicalGuideAssetId,
    )
    const frameAssets = await this.findAssetsByIds(updateMovieDto.stillAssetIds)

    const subgenres = updateMovieDto.subGenreIds?.length
      ? await this.subGenreRepository.findBy({
          id: In(updateMovieDto.subGenreIds),
        })
      : []

    const filmingCities = updateMovieDto.filmingCitiesEc?.length
      ? await this.findCitiesByNames(updateMovieDto.filmingCitiesEc)
      : []

    const languages = updateMovieDto.languages?.length
      ? await this.languageRepository.findBy({
          code: In(updateMovieDto.languages),
        })
      : []

    const subtitleLanguages = updateMovieDto.subtitleLanguageIds?.length
      ? await this.languageRepository.findBy({
          id: In(updateMovieDto.subtitleLanguageIds),
        })
      : []

    const movie = this.movieRepository.create({
      ...existingMovie,
      title: updateMovieDto.title,
      titleEn: updateMovieDto.titleEn ?? null,
      durationMinutes: updateMovieDto.durationMinutes,
      type: updateMovieDto.type,
      genre: updateMovieDto.genre,
      releaseYear: updateMovieDto.releaseYear,
      country: { id: updateMovieDto.countryId } as Movie['country'],
      synopsis: updateMovieDto.synopsis,
      synopsisEn: updateMovieDto.synopsisEn ?? null,
      logline: updateMovieDto.logLine ?? null,
      loglineEn: updateMovieDto.logLineEn ?? null,
      classification: updateMovieDto.classification,
      projectStatus: updateMovieDto.projectStatus,
      projectNeed: updateMovieDto.projectNeed ?? null,
      projectNeedEn: updateMovieDto.projectNeedEn ?? null,
      createdBy: existingMovie.createdBy ?? ({ id: userId } as Movie['createdBy']),
      subgenres,
      languages,
      cities: filmingCities,
      posterAsset,
      dossierAsset,
      dossierAssetEn,
      pedagogicalSheetAsset,
      trailerLink: updateMovieDto.trailerLink?.trim() || null,
      makingOfLink: updateMovieDto.makingOfLink?.trim() || null,
      frameAssets,
      crewTotal: updateMovieDto.crewTotal ?? null,
      actorsTotal: updateMovieDto.actorsTotal ?? null,
      totalBudget:
        updateMovieDto.totalBudget !== undefined
          ? String(updateMovieDto.totalBudget)
          : null,
      economicRecovery:
        updateMovieDto.economicRecovery !== undefined
          ? String(updateMovieDto.economicRecovery)
          : null,
      spectatorsCount: updateMovieDto.totalAudience ?? null,
    })

    await this.movieRepository.save(movie)

    await this.movieCompanyRepository.delete({ movieId: id })
    await this.movieInternationalCoproductionRepository.delete({ movieId: id })
    await this.movieFilmingCountryRepository.delete({ movieId: id })
    await this.movieFundingRepository.delete({ movieId: id })
    await this.movieNationalReleaseRepository.delete({ movieId: id })
    await this.movieInternationalReleaseRepository.delete({ movieId: id })
    await this.movieFestivalNominationRepository.delete({ movieId: id })
    await this.moviePlatformRepository.delete({ movieId: id })
    await this.movieContactRepository.delete({ movieId: id })
    await this.movieContentBankRepository.delete({ movieId: id })
    await this.movieSubtitleRepository.delete({ movieId: id })
    await this.movieProfessionalRepository.delete({ movieId: id })

    const companyRows: MovieCompany[] = []

    if (updateMovieDto.producerCompanyId) {
      companyRows.push(
        this.movieCompanyRepository.create({
          movieId: id,
          companyId: updateMovieDto.producerCompanyId,
          participation: CompanyParticipationType.PRODUCER,
        }),
      )
    }

    if (updateMovieDto.coProducerCompanyIds?.length) {
      updateMovieDto.coProducerCompanyIds.forEach((companyId) => {
        companyRows.push(
          this.movieCompanyRepository.create({
            movieId: id,
            companyId,
            participation: CompanyParticipationType.CO_PRODUCER,
          }),
        )
      })
    }

    if (companyRows.length) {
      await this.movieCompanyRepository.save(companyRows)
    }

    if (updateMovieDto.internationalCoproductions?.length) {
      const coproductionRows = updateMovieDto.internationalCoproductions.map(
        (entry) =>
          this.movieInternationalCoproductionRepository.create({
            movieId: id,
            companyName: entry.companyName,
            countryId: entry.countryId,
          }),
      )
      await this.movieInternationalCoproductionRepository.save(coproductionRows)
    }

    if (updateMovieDto.filmingCountries?.length) {
      const countries = await this.findCountriesByCodes(
        updateMovieDto.filmingCountries,
      )
      const filmingRows = countries.map((country) =>
        this.movieFilmingCountryRepository.create({
          movieId: id,
          countryId: country.id,
        }),
      )
      if (filmingRows.length) {
        await this.movieFilmingCountryRepository.save(filmingRows)
      }
    }

    if (updateMovieDto.funding?.length) {
      const fundingRows = updateMovieDto.funding.map((entry) =>
        this.movieFundingRepository.create({
          movieId: id,
          fundId: entry.fundId,
          year: entry.year,
          amountGranted: entry.amountGranted ?? undefined,
          fundingStage: entry.fundingStage,
        }),
      )
      await this.movieFundingRepository.save(fundingRows)
    }

    if (updateMovieDto.nationalReleases?.length) {
      const nationalRows = updateMovieDto.nationalReleases.map((entry) =>
        this.movieNationalReleaseRepository.create({
          movieId: id,
          exhibitionSpaceId: entry.exhibitionSpaceId,
          cityId: entry.cityId,
          year: entry.year,
          type: entry.type,
        }),
      )
      await this.movieNationalReleaseRepository.save(nationalRows)
    }

    if (updateMovieDto.internationalReleases?.length) {
      const internationalRows = updateMovieDto.internationalReleases.map(
        (entry) =>
          this.movieInternationalReleaseRepository.create({
            movieId: id,
            countryId: entry.countryId,
            year: entry.year,
            type: entry.type,
            spaceName: entry.spaceName?.trim() || null,
          }),
      )
      await this.movieInternationalReleaseRepository.save(internationalRows)
    }

    if (updateMovieDto.festivalNominations?.length) {
      const festivalRows = updateMovieDto.festivalNominations.map((entry) =>
        this.movieFestivalNominationRepository.create({
          movieId: id,
          fundId: entry.fundId,
          year: entry.year,
          category: entry.category.trim(),
          result: entry.result,
        }),
      )
      await this.movieFestivalNominationRepository.save(festivalRows)
    }

    if (updateMovieDto.platforms?.length) {
      const platformRows = updateMovieDto.platforms.map((entry) =>
        this.moviePlatformRepository.create({
          movieId: id,
          platformId: entry.platformId,
          link: entry.link?.trim() || null,
        }),
      )
      await this.moviePlatformRepository.save(platformRows)
    }

    if (updateMovieDto.contacts?.length) {
      const contactRows = updateMovieDto.contacts.map((entry) =>
        this.movieContactRepository.create({
          movieId: id,
          name: entry.name.trim(),
          role: entry.role,
          phone: entry.phone?.trim() || null,
          email: entry.email?.trim() || null,
        }),
      )
      await this.movieContactRepository.save(contactRows)
    }

    if (updateMovieDto.contentBank?.length) {
      const contentRows = updateMovieDto.contentBank.map((entry) =>
        this.movieContentBankRepository.create({
          movieId: id,
          exhibitionWindow: entry.exhibitionWindow,
          licensingStartDate: new Date(entry.licensingStartDate),
          licensingEndDate: new Date(entry.licensingEndDate),
          geolocationRestrictionCountryIds:
            entry.geolocationRestrictionCountryIds?.length
              ? entry.geolocationRestrictionCountryIds
              : null,
        }),
      )
      await this.movieContentBankRepository.save(contentRows)
    }

    if (subtitleLanguages.length) {
      const subtitleRows = subtitleLanguages.map((language) =>
        this.movieSubtitleRepository.create({
          movieId: id,
          languageId: language.id,
        }),
      )
      await this.movieSubtitleRepository.save(subtitleRows)
    }

    const professionalRows: MovieProfessional[] = []
    const addedKeys = new Set<string>()

    const addProfessional = (professionalId: number, roleId: number | null) => {
      if (!roleId) return
      const key = `${professionalId}-${roleId}`
      if (addedKeys.has(key)) return
      addedKeys.add(key)
      professionalRows.push(
        this.movieProfessionalRepository.create({
          movieId: id,
          professionalId,
          cinematicRoleId: roleId,
          accredited: true,
        }),
      )
    }

    updateMovieDto.directors?.forEach((professionalId) =>
      addProfessional(professionalId, directorRoleId),
    )

    updateMovieDto.producers?.forEach((professionalId) =>
      addProfessional(professionalId, producerRoleId),
    )

    updateMovieDto.mainActors?.forEach((professionalId) =>
      addProfessional(professionalId, actorRoleId),
    )

    updateMovieDto.crew?.forEach((entry) =>
      addProfessional(entry.professionalId, entry.cinematicRoleId),
    )

    if (professionalRows.length) {
      await this.movieProfessionalRepository.save(professionalRows)
    }

    return this.findOne(id)
  }

  private async findAssetOrThrow(assetId?: number): Promise<Asset | null> {
    if (!assetId) return null
    const asset = await this.assetRepository.findOne({
      where: { id: assetId },
    })

    if (!asset) {
      throw new NotFoundException(`Asset with ID ${assetId} not found`)
    }

    return asset
  }

  private async findAssetsByIds(assetIds?: number[]): Promise<Asset[]> {
    if (!assetIds?.length) return []

    const assets = await this.assetRepository.findBy({
      id: In(assetIds),
    })

    const foundIds = new Set(assets.map((asset) => asset.id))
    const missing = assetIds.filter((id) => !foundIds.has(id))

    if (missing.length > 0) {
      throw new NotFoundException(
        `Assets not found: ${missing.join(', ')}`,
      )
    }

    return assets
  }

  private async findCitiesByNames(names: string[]): Promise<City[]> {
    if (!names.length) return []

    const cities = await this.cityRepository.findBy({
      name: In(names),
    })

    return cities
  }

  private async findCountriesByCodes(codes: string[]): Promise<Country[]> {
    if (!codes.length) return []

    const countries = await this.countryRepository.findBy({
      code: In(codes),
    })

    const foundCodes = new Set(countries.map((country) => country.code))
    const missing = codes.filter((code) => !foundCodes.has(code))

    if (missing.length > 0) {
      throw new NotFoundException(
        `Countries not found: ${missing.join(', ')}`,
      )
    }

    return countries
  }

  private async getCinematicRoleIdByName(name: string): Promise<number> {
    const role = await this.cinematicRoleRepository.findOne({
      where: { name },
    })

    if (!role) {
      throw new NotFoundException(`Cinematic role with name ${name} not found`)
    }

    return role.id
  }

  async updateCastCrew(
    movieId: number,
    updateCastCrewDto: UpdateMovieCastCrewDto,
  ): Promise<Movie> {
    // Verify movie exists
    await this.findOne(movieId)

    const directorRoleId = MoviesService.DIRECTOR_ROLE_ID
    const producerRoleId = MoviesService.PRODUCER_ROLE_ID

    // Update directors
    if (updateCastCrewDto.directors !== undefined) {
      // Remove existing directors
      await this.movieProfessionalRepository.delete({
        movieId,
        cinematicRoleId: directorRoleId,
      })

      // Add new directors
      if (updateCastCrewDto.directors.length > 0) {
        const directorsToAdd = updateCastCrewDto.directors.map(
          (professionalId) => {
            return this.movieProfessionalRepository.create({
              movieId,
              professionalId,
              cinematicRoleId: directorRoleId,
              accredited: true,
            })
          },
        )
        await this.movieProfessionalRepository.save(directorsToAdd)
      }
    }

    // Update producers
    if (updateCastCrewDto.producers !== undefined) {
      // Remove existing producers
      await this.movieProfessionalRepository.delete({
        movieId,
        cinematicRoleId: producerRoleId,
      })

      // Add new producers
      if (updateCastCrewDto.producers.length > 0) {
        const producersToAdd = updateCastCrewDto.producers.map(
          (professionalId) => {
            return this.movieProfessionalRepository.create({
              movieId,
              professionalId,
              cinematicRoleId: producerRoleId,
              accredited: true,
            })
          },
        )
        await this.movieProfessionalRepository.save(producersToAdd)
      }
    }

    return this.findOne(movieId)
  }

  async toggleActive(id: number): Promise<Movie> {
    const movie = await this.movieRepository.findOne({
      where: { id },
    })

    if (!movie) {
      throw new NotFoundException(`Movie with ID ${id} not found`)
    }

    movie.isActive = !movie.isActive
    await this.movieRepository.save(movie)

    return this.findOne(id)
  }

  async getProfessionalsByRole(
    movieId: number,
    cinematicRoleId: number,
  ): Promise<MovieProfessional[]> {
    return this.movieProfessionalRepository.find({
      where: { movieId, cinematicRoleId },
      relations: ['professional'],
    })
  }
}
