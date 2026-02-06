import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { In, Repository } from 'typeorm'
import { Movie } from './entities/movie.entity'
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
import { CreateMovieDto } from './dto/create-movie.dto'
import { SubGenre } from '../catalog/entities/subgenre.entity'
import { Language } from '../catalog/entities/language.entity'
import { Asset } from '../assets/entities/asset.entity'
import { City } from '../catalog/entities/city.entity'
import { Country } from '../catalog/entities/country.entity'

@Injectable()
export class MoviesService {
  private static readonly DIRECTOR_ROLE_ID = 1
  private static readonly PRODUCER_ROLE_ID = 2
  private static readonly ACTOR_ROLE_ID = 20

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
  ) {}

  // Placeholder for future movie creation logic
  async findAll(): Promise<Movie[]> {
    return this.movieRepository.find({
      relations: ['languages', 'country', 'cities'],
    })
  }

  async findOne(id: number): Promise<Movie> {
    const movie = await this.movieRepository.findOne({
      where: { id },
      relations: [
        'languages',
        'country',
        'cities',
        'professionals',
        'professionals.professional',
      ],
    })

    if (!movie) {
      throw new NotFoundException(`Movie with ID ${id} not found`)
    }

    return movie
  }

  async create(createMovieDto: CreateMovieDto): Promise<Movie> {
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
      projectNeed: createMovieDto.projectNeed ?? null,
      projectNeedEn: createMovieDto.projectNeedEn ?? null,
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

    const foundNames = new Set(cities.map((city) => city.name))
    const missing = names.filter((name) => !foundNames.has(name))

    if (missing.length > 0) {
      throw new NotFoundException(
        `Cities not found: ${missing.join(', ')}`,
      )
    }

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
            })
          },
        )
        await this.movieProfessionalRepository.save(producersToAdd)
      }
    }

    return this.findOne(movieId)
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
