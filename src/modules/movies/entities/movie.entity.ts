import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  ManyToOne,
  OneToMany,
  JoinTable,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm'
import { Language } from '../../catalog/entities/language.entity'
import { Country } from '../../catalog/entities/country.entity'
import { Province } from '../../catalog/entities/province.entity'
import { City } from '../../catalog/entities/city.entity'
import { SubGenre } from '../../catalog/entities/subgenre.entity'
import { User } from '../../users/entities/user.entity'
import { Asset } from '../../assets/entities/asset.entity'
import { MovieProfessional } from './movie-professional.entity'
import { MovieFunding } from './movie-funding.entity'
import { MovieFestivalNomination } from './movie-festival-nomination.entity'
import { MovieNationalRelease } from './movie-national-release.entity'
import { MovieInternationalRelease } from './movie-international-release.entity'
import { MovieContentBank } from './movie-content-bank.entity'
import { MoviePlatform } from './movie-platform.entity'
import { MovieCompany } from './movie-company.entity'
import { MovieContact } from './movie-contact.entity'

export enum MovieType {
  SHORT_FILM = 'Cortometraje',
  MEDIUM_FILM = 'Mediometraje',
  FEATURE_FILM = 'Largometraje',
}

export enum GenreType {
  FICTION = 'Ficción',
  DOCUMENTARY = 'Documental',
  DOCU_FICTION = 'Docu-ficción',
  MOCKUMENTARY = 'Falso Documental',
}

export enum MovieClassification {
  TODO_PUBLICO = 'todo_publico',
  RECOMENDADO_0_6 = 'recomendado_0_6',
  RECOMENDADO_6_12 = 'recomendado_6_12',
  MENORES_12_SUPERVISION = 'menores_12_supervision',
  MAYORES_12 = 'mayores_12',
  MAYORES_15 = 'mayores_15',
  SOLO_MAYORES_18 = 'solo_mayores_18',
}

export enum ProjectStatus {
  DESARROLLO = 'desarrollo',
  PRODUCCION = 'produccion',
  POST_PRODUCCION = 'postproduccion',
  DISTRIBUCION = 'distribucion',
  FINALIZADO = 'finalizado',
}

export enum MovieStatusEnum {
  DRAFT = 'draft',
  IN_REVIEW = 'in_review',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  ARCHIVED = 'archived',
}

@Entity('movies')
export class Movie {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ type: 'varchar', length: 255 })
  title: string

  @Column({ type: 'varchar', length: 255, nullable: true })
  titleEn: string | null

  @Column({ type: 'int' })
  durationMinutes: number

  @Column({ type: 'enum', enum: MovieType })
  type: MovieType

  @Column({ type: 'enum', enum: GenreType })
  genre: GenreType

  @ManyToMany(() => SubGenre, (subgenre) => subgenre.movies, {
    cascade: false,
  })
  @JoinTable({
    name: 'movies_subgenres',
    joinColumn: { name: 'movieId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'subgenreId', referencedColumnName: 'id' },
  })
  subgenres: SubGenre[]

  @ManyToMany(() => Language, (language) => language.movies, {
    cascade: false,
  })
  @JoinTable({
    name: 'movies_languages',
    joinColumn: { name: 'movieId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'languageId', referencedColumnName: 'id' },
  })
  languages: Language[]

  @ManyToOne(() => Country, (country) => country.movies, {
    onDelete: 'RESTRICT',
    nullable: false,
  })
  country: Country

  @ManyToMany(() => Province, (province) => province.movies, {
    cascade: false,
  })
  @JoinTable({
    name: 'movies_provinces',
    joinColumn: { name: 'movieId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'provinceId', referencedColumnName: 'id' },
  })
  provinces: Province[]

  @ManyToMany(() => City, (city) => city.movies, {
    cascade: false,
  })
  @JoinTable({
    name: 'movies_cities',
    joinColumn: { name: 'movieId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'cityId', referencedColumnName: 'id' },
  })
  cities: City[]

  @Column({ type: 'int', nullable: true })
  releaseYear: number | null

  @Column({ type: 'text' })
  synopsis: string

  @Column({ type: 'text', nullable: true })
  synopsisEn: string | null

  @Column({ type: 'text', nullable: true })
  logline: string | null

  @Column({ type: 'text', nullable: true })
  loglineEn: string | null

  @Column({ type: 'enum', enum: MovieClassification })
  classification: MovieClassification

  @Column({ type: 'enum', enum: ProjectStatus })
  projectStatus: ProjectStatus

  @Column({ type: 'numeric', precision: 14, scale: 2, nullable: true })
  totalBudget: string | null

  @Column({ type: 'numeric', precision: 14, scale: 2, nullable: true })
  economicRecovery: string | null

  @Column({ type: 'int', nullable: true })
  spectatorsCount: number | null

  @Column({ type: 'int', nullable: true })
  crewTotal: number | null

  @Column({ type: 'int', nullable: true })
  actorsTotal: number | null

  @Column({ type: 'text', nullable: true })
  projectNeed: string | null

  @Column({ type: 'text', nullable: true })
  projectNeedEn: string | null

  @ManyToOne(() => Asset, { nullable: true, onDelete: 'SET NULL' })
  posterAsset: Asset | null

  @ManyToMany(() => Asset, {
    cascade: false,
  })
  @JoinTable({
    name: 'movies_frame_assets',
    joinColumn: { name: 'movieId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'assetId', referencedColumnName: 'id' },
  })
  frameAssets: Asset[]

  @ManyToOne(() => Asset, { nullable: true, onDelete: 'SET NULL' })
  dossierAsset: Asset | null

  @ManyToOne(() => Asset, { nullable: true, onDelete: 'SET NULL' })
  dossierAssetEn: Asset | null

  @ManyToOne(() => Asset, { nullable: true, onDelete: 'SET NULL' })
  pedagogicalSheetAsset: Asset | null

  @Column({ type: 'varchar', length: 500, nullable: true })
  trailerLink: string | null

  @Column({ type: 'varchar', length: 500, nullable: true })
  makingOfLink: string | null

  @ManyToOne(() => User, { nullable: false, onDelete: 'RESTRICT' })
  createdBy: User

  @Column({ type: 'int', nullable: true })
  ownerId: number | null

  @ManyToOne(() => User, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'ownerId' })
  owner: User | null

  @OneToMany(
    () => MovieProfessional,
    (movieProfessional) => movieProfessional.movie,
  )
  professionals: MovieProfessional[]

  @OneToMany(() => MovieFunding, (funding) => funding.movie)
  funding: MovieFunding[]

  @OneToMany(() => MovieFestivalNomination, (nomination) => nomination.movie)
  festivalNominations: MovieFestivalNomination[]

  @OneToMany(() => MovieNationalRelease, (release) => release.movie)
  nationalReleases: MovieNationalRelease[]

  @OneToMany(() => MovieInternationalRelease, (release) => release.movie)
  internationalReleases: MovieInternationalRelease[]

  @OneToMany(() => MovieContentBank, (contentBank) => contentBank.movie)
  contentBank: MovieContentBank[]

  @OneToMany(() => MoviePlatform, (moviePlatform) => moviePlatform.movie)
  platforms: MoviePlatform[]

  @OneToMany(() => MovieCompany, (movieCompany) => movieCompany.movie)
  companies: MovieCompany[]

  @OneToMany(() => MovieContact, (movieContact) => movieContact.movie)
  contacts: MovieContact[]

  @Column({ type: 'boolean', default: true })
  isActive: boolean

  @Column({
    type: 'enum',
    enum: MovieStatusEnum,
    default: MovieStatusEnum.DRAFT,
  })
  status: MovieStatusEnum

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn({ nullable: true })
  updatedAt: Date | null
}
