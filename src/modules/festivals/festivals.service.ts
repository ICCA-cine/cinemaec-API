import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { EntityManager, Repository } from 'typeorm'
import { Festival } from './entities/festival.entity'
import { CreateFestivalDto } from './dto/create-festival.dto'
import { UpdateFestivalDto } from './dto/update-festival.dto'
import { FestivalCity } from './entities/festival-city.entity'
import { FestivalCompany } from './entities/festival-company.entity'
import {
  FestivalProfessional,
  FestivalProfessionalRole,
} from './entities/festival-professional.entity'
import { FestivalStill } from './entities/festival-still.entity'
import { FestivalSection } from './entities/festival-section.entity'
import { FestivalModality } from './entities/festival-modality.entity'

type FestivalResponse = {
  id: number
  name: string
  editionCount: number
  firstEditionYear: number
  type: string
  hostCities: number[]
  modality: string[]
  mainVenue: number | null
  website: string | null
  theme: string | null
  producerCompanyIds: number[]
  description: string
  descriptionEn: string | null
  directors: number[]
  producerIds: number[]
  programmers: number[]
  directorObjects: Array<{
    id: number
    name: string | null
    photoUrl: string | null
    filmography: string | null
  }>
  producerObjects: Array<{
    id: number
    name: string | null
    photoUrl: string | null
    filmography: string | null
  }>
  classification: string
  contactName: string
  contactEmail: string
  contactPhone: string
  posterId: number | null
  trailer: string | null
  stillsIds: number[]
  needs: string | null
  needsEn: string | null
  dossierEsId: number | null
  dossierEnId: number | null
  sections: Array<{ name: string; competitive: boolean }>
  hasCall: boolean
  callProcess: string | null
  callLink: string | null
  createdById: number | null
  updatedById: number | null
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

@Injectable()
export class FestivalsService {
  private readonly festivalRelations = [
    'hostCitiesRelations',
    'modalities',
    'companies',
    'professionals',
    'professionals.professional',
    'professionals.professional.profilePhotoAsset',
    'stills',
    'sections',
  ] as const

  constructor(
    @InjectRepository(Festival)
    private readonly festivalsRepository: Repository<Festival>,
  ) {}

  async create(
    createFestivalDto: CreateFestivalDto,
    createdById?: number,
  ): Promise<FestivalResponse> {
    return await this.festivalsRepository.manager.transaction(
      async (manager) => {
        const festivalRepository = manager.getRepository(Festival)

        const festival = festivalRepository.create({
          name: createFestivalDto.name,
          editionCount: createFestivalDto.editionCount,
          firstEditionYear: createFestivalDto.firstEditionYear,
          type: createFestivalDto.type.trim(),
          website: createFestivalDto.website ?? null,
          theme: createFestivalDto.theme,
          description: createFestivalDto.description,
          descriptionEn: createFestivalDto.descriptionEn ?? null,
          classification: createFestivalDto.classification.trim(),
          contactName: createFestivalDto.contactName,
          contactEmail: createFestivalDto.contactEmail,
          contactPhone: createFestivalDto.contactPhone,
          posterId: createFestivalDto.posterId ?? null,
          trailer: createFestivalDto.trailer ?? null,
          needs: createFestivalDto.needs ?? null,
          needsEn: createFestivalDto.needsEn ?? null,
          dossierEsId: createFestivalDto.dossierEsId ?? null,
          dossierEnId: createFestivalDto.dossierEnId ?? null,
          hasCall: createFestivalDto.hasCall ?? false,
          callProcess: createFestivalDto.callProcess ?? null,
          callLink: createFestivalDto.callLink ?? null,
          createdById: createdById ?? null,
          updatedById: createdById ?? null,
          isActive: createFestivalDto.isActive ?? true,
        })

        const savedFestival = await festivalRepository.save(festival)

        await this.replaceFestivalRelations(manager, savedFestival.id, {
          hostCities: createFestivalDto.hostCities,
          mainVenue: createFestivalDto.mainVenue,
          modality: createFestivalDto.modality,
          producerCompanyIds: createFestivalDto.producerCompanyIds ?? [],
          directors: createFestivalDto.directors ?? [],
          producerIds: createFestivalDto.producerIds ?? [],
          programmers: createFestivalDto.programmers ?? [],
          stillsIds: createFestivalDto.stillsIds ?? [],
          sections: createFestivalDto.sections ?? [],
        })

        const createdFestival = await festivalRepository.findOne({
          where: { id: savedFestival.id },
          relations: [...this.festivalRelations],
        })

        if (!createdFestival) {
          throw new NotFoundException(
            `Festival with ID ${savedFestival.id} not found after creation`,
          )
        }

        return this.mapFestivalToResponse(createdFestival)
      },
    )
  }

  async findAll(): Promise<FestivalResponse[]> {
    const festivals = await this.festivalsRepository.find({
      relations: [...this.festivalRelations],
      order: { createdAt: 'DESC' },
    })

    return festivals.map((festival) => this.mapFestivalToResponse(festival))
  }

  async findOne(id: number): Promise<FestivalResponse> {
    const festival = await this.festivalsRepository.findOne({
      where: { id },
      relations: [...this.festivalRelations],
    })

    if (!festival) {
      throw new NotFoundException(`Festival with ID ${id} not found`)
    }

    return this.mapFestivalToResponse(festival)
  }

  async update(
    id: number,
    updateFestivalDto: UpdateFestivalDto,
    updatedById?: number,
  ): Promise<FestivalResponse> {
    return await this.festivalsRepository.manager.transaction(
      async (manager) => {
        const festivalRepository = manager.getRepository(Festival)

        const festival = await festivalRepository.findOne({
          where: { id },
          relations: [...this.festivalRelations],
        })

        if (!festival) {
          throw new NotFoundException(`Festival with ID ${id} not found`)
        }

        if (updateFestivalDto.name !== undefined)
          festival.name = updateFestivalDto.name
        if (updateFestivalDto.editionCount !== undefined) {
          festival.editionCount = updateFestivalDto.editionCount
        }
        if (updateFestivalDto.firstEditionYear !== undefined) {
          festival.firstEditionYear = updateFestivalDto.firstEditionYear
        }
        if (updateFestivalDto.type !== undefined) {
          festival.type = updateFestivalDto.type.trim()
        }
        if (updateFestivalDto.website !== undefined) {
          festival.website = updateFestivalDto.website ?? null
        }
        if (updateFestivalDto.theme !== undefined) {
          festival.theme = updateFestivalDto.theme
        }
        if (updateFestivalDto.description !== undefined) {
          festival.description = updateFestivalDto.description
        }
        if (updateFestivalDto.descriptionEn !== undefined) {
          festival.descriptionEn = updateFestivalDto.descriptionEn ?? null
        }
        if (updateFestivalDto.classification !== undefined) {
          festival.classification = updateFestivalDto.classification.trim()
        }
        if (updateFestivalDto.contactName !== undefined) {
          festival.contactName = updateFestivalDto.contactName
        }
        if (updateFestivalDto.contactEmail !== undefined) {
          festival.contactEmail = updateFestivalDto.contactEmail
        }
        if (updateFestivalDto.contactPhone !== undefined) {
          festival.contactPhone = updateFestivalDto.contactPhone
        }
        if (updateFestivalDto.posterId !== undefined) {
          festival.posterId = updateFestivalDto.posterId ?? null
        }
        if (updateFestivalDto.trailer !== undefined) {
          festival.trailer = updateFestivalDto.trailer ?? null
        }
        if (updateFestivalDto.needs !== undefined) {
          festival.needs = updateFestivalDto.needs ?? null
        }
        if (updateFestivalDto.needsEn !== undefined) {
          festival.needsEn = updateFestivalDto.needsEn ?? null
        }
        if (updateFestivalDto.dossierEsId !== undefined) {
          festival.dossierEsId = updateFestivalDto.dossierEsId ?? null
        }
        if (updateFestivalDto.dossierEnId !== undefined) {
          festival.dossierEnId = updateFestivalDto.dossierEnId ?? null
        }
        if (updateFestivalDto.hasCall !== undefined) {
          festival.hasCall = updateFestivalDto.hasCall
        }
        if (updateFestivalDto.callProcess !== undefined) {
          festival.callProcess = updateFestivalDto.callProcess ?? null
        }
        if (updateFestivalDto.callLink !== undefined) {
          festival.callLink = updateFestivalDto.callLink ?? null
        }
        if (updateFestivalDto.isActive !== undefined) {
          festival.isActive = updateFestivalDto.isActive
        }

        festival.updatedById = updatedById ?? festival.updatedById

        await festivalRepository.save(festival)

        await this.replaceFestivalRelations(manager, festival.id, {
          hostCities:
            updateFestivalDto.hostCities ??
            festival.hostCitiesRelations.map((row) => row.cityId),
          mainVenue:
            updateFestivalDto.mainVenue ??
            festival.hostCitiesRelations.find((row) => row.isMainVenue)
              ?.cityId ??
            null,
          modality:
            updateFestivalDto.modality ??
            festival.modalities.map((row) => row.value),
          producerCompanyIds:
            updateFestivalDto.producerCompanyIds ??
            festival.companies.map((row) => row.companyId),
          directors:
            updateFestivalDto.directors ??
            festival.professionals
              .filter((row) => row.role === FestivalProfessionalRole.DIRECTOR)
              .map((row) => row.professionalId),
          producerIds:
            updateFestivalDto.producerIds ??
            festival.professionals
              .filter((row) => row.role === FestivalProfessionalRole.PRODUCER)
              .map((row) => row.professionalId),
          programmers:
            updateFestivalDto.programmers ??
            festival.professionals
              .filter((row) => row.role === FestivalProfessionalRole.PROGRAMMER)
              .map((row) => row.professionalId),
          stillsIds:
            updateFestivalDto.stillsIds ??
            festival.stills.map((row) => row.assetId),
          sections:
            updateFestivalDto.sections ??
            festival.sections.map((row) => ({
              name: row.name,
              competitive: row.competitive,
            })),
        })

        const updatedFestival = await festivalRepository.findOne({
          where: { id: festival.id },
          relations: [...this.festivalRelations],
        })

        if (!updatedFestival) {
          throw new NotFoundException(
            `Festival with ID ${festival.id} not found after update`,
          )
        }

        return this.mapFestivalToResponse(updatedFestival)
      },
    )
  }

  async remove(id: number): Promise<void> {
    const festival = await this.festivalsRepository.findOne({ where: { id } })

    if (!festival) {
      throw new NotFoundException(`Festival with ID ${id} not found`)
    }

    await this.festivalsRepository.remove(festival)
  }

  private mapFestivalToResponse(festival: Festival): FestivalResponse {
    const directors = festival.professionals
      .filter((row) => row.role === FestivalProfessionalRole.DIRECTOR)
      .map((row) => row.professionalId)

    const producerIds = festival.professionals
      .filter((row) => row.role === FestivalProfessionalRole.PRODUCER)
      .map((row) => row.professionalId)

    const directorObjects = festival.professionals
      .filter((row) => row.role === FestivalProfessionalRole.DIRECTOR)
      .map((row) => ({
        id: row.professionalId,
        name: row.professional?.name ?? null,
        photoUrl: row.professional?.profilePhotoAsset?.url ?? null,
        filmography: row.professional?.extendedBiofilmography ?? null,
      }))

    const producerObjects = festival.professionals
      .filter((row) => row.role === FestivalProfessionalRole.PRODUCER)
      .map((row) => ({
        id: row.professionalId,
        name: row.professional?.name ?? null,
        photoUrl: row.professional?.profilePhotoAsset?.url ?? null,
        filmography: row.professional?.extendedBiofilmography ?? null,
      }))

    const programmers = festival.professionals
      .filter((row) => row.role === FestivalProfessionalRole.PROGRAMMER)
      .map((row) => row.professionalId)

    const mainVenue =
      festival.hostCitiesRelations.find((row) => row.isMainVenue)?.cityId ??
      null

    return {
      id: festival.id,
      name: festival.name,
      editionCount: festival.editionCount,
      firstEditionYear: festival.firstEditionYear,
      type: festival.type,
      hostCities: festival.hostCitiesRelations.map((row) => row.cityId),
      modality: festival.modalities.map((row) => row.value),
      mainVenue,
      website: festival.website,
      theme: festival.theme,
      producerCompanyIds: festival.companies.map((row) => row.companyId),
      description: festival.description,
      descriptionEn: festival.descriptionEn,
      directors,
      producerIds,
      directorObjects,
      producerObjects,
      programmers,
      classification: festival.classification,
      contactName: festival.contactName,
      contactEmail: festival.contactEmail,
      contactPhone: festival.contactPhone,
      posterId: festival.posterId,
      trailer: festival.trailer,
      stillsIds: festival.stills.map((row) => row.assetId),
      needs: festival.needs,
      needsEn: festival.needsEn,
      dossierEsId: festival.dossierEsId,
      dossierEnId: festival.dossierEnId,
      sections: festival.sections.map((row) => ({
        name: row.name,
        competitive: row.competitive,
      })),
      hasCall: festival.hasCall,
      callProcess: festival.callProcess,
      callLink: festival.callLink,
      createdById: festival.createdById,
      updatedById: festival.updatedById,
      isActive: festival.isActive,
      createdAt: festival.createdAt,
      updatedAt: festival.updatedAt,
    }
  }

  private async replaceFestivalRelations(
    manager: EntityManager,
    festivalId: number,
    relations: {
      hostCities: number[]
      mainVenue: number | null
      modality: string[]
      producerCompanyIds: number[]
      directors: number[]
      producerIds: number[]
      programmers: number[]
      stillsIds: number[]
      sections: Array<{ name: string; competitive: boolean }>
    },
  ): Promise<void> {
    const festivalCityRepository = manager.getRepository(FestivalCity)
    const festivalModalityRepository = manager.getRepository(FestivalModality)
    const festivalCompanyRepository = manager.getRepository(FestivalCompany)
    const festivalProfessionalRepository =
      manager.getRepository(FestivalProfessional)
    const festivalStillRepository = manager.getRepository(FestivalStill)
    const festivalSectionRepository = manager.getRepository(FestivalSection)

    await Promise.all([
      festivalCityRepository.delete({ festivalId }),
      festivalModalityRepository.delete({ festivalId }),
      festivalCompanyRepository.delete({ festivalId }),
      festivalProfessionalRepository.delete({ festivalId }),
      festivalStillRepository.delete({ festivalId }),
      festivalSectionRepository.delete({ festivalId }),
    ])

    const mainVenue = relations.mainVenue ?? null
    const hostCities = Array.from(
      new Set([
        ...relations.hostCities,
        ...(mainVenue !== null ? [mainVenue] : []),
      ]),
    )

    if (hostCities.length > 0) {
      await festivalCityRepository.save(
        hostCities.map((cityId) =>
          festivalCityRepository.create({
            festivalId,
            cityId,
            isMainVenue: mainVenue !== null && cityId === mainVenue,
          }),
        ),
      )
    }

    const normalizedModalities = Array.from(
      new Set(relations.modality.filter((value) => value.trim().length > 0)),
    )

    if (normalizedModalities.length > 0) {
      await festivalModalityRepository.save(
        normalizedModalities.map((value) =>
          festivalModalityRepository.create({
            festivalId,
            value,
          }),
        ),
      )
    }

    const companyIds = Array.from(new Set(relations.producerCompanyIds))
    if (companyIds.length > 0) {
      await festivalCompanyRepository.save(
        companyIds.map((companyId) =>
          festivalCompanyRepository.create({
            festivalId,
            companyId,
          }),
        ),
      )
    }

    const professionalsToInsert = [
      ...Array.from(new Set(relations.directors)).map((professionalId) => ({
        professionalId,
        role: FestivalProfessionalRole.DIRECTOR,
      })),
      ...Array.from(new Set(relations.producerIds)).map((professionalId) => ({
        professionalId,
        role: FestivalProfessionalRole.PRODUCER,
      })),
      ...Array.from(new Set(relations.programmers)).map((professionalId) => ({
        professionalId,
        role: FestivalProfessionalRole.PROGRAMMER,
      })),
    ]

    if (professionalsToInsert.length > 0) {
      await festivalProfessionalRepository.save(
        professionalsToInsert.map(({ professionalId, role }) =>
          festivalProfessionalRepository.create({
            festivalId,
            professionalId,
            role,
          }),
        ),
      )
    }

    const stillsIds = Array.from(new Set(relations.stillsIds))
    if (stillsIds.length > 0) {
      await festivalStillRepository.save(
        stillsIds.map((assetId) =>
          festivalStillRepository.create({
            festivalId,
            assetId,
          }),
        ),
      )
    }

    const sections = relations.sections.filter(
      (section) => section.name.trim().length > 0,
    )
    if (sections.length > 0) {
      await festivalSectionRepository.save(
        sections.map((section) =>
          festivalSectionRepository.create({
            festivalId,
            name: section.name.trim(),
            competitive: section.competitive,
          }),
        ),
      )
    }
  }
}
