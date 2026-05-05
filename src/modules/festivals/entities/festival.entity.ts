import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'
import { Asset } from '../../assets/entities/asset.entity'
import { FestivalCity } from './festival-city.entity'
import { FestivalCompany } from './festival-company.entity'
import { FestivalStill } from './festival-still.entity'
import { FestivalProfessional } from './festival-professional.entity'
import { FestivalSection } from './festival-section.entity'
import { FestivalModality } from './festival-modality.entity'
import { FestivalType } from './festival-type.entity'
import { FestivalClassification } from './festival-classification.entity'

@Entity('festivals')
export class Festival {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ type: 'varchar', length: 255 })
  name: string

  @Column({ type: 'int', nullable: false })
  editionCount: number

  @Column({ type: 'int', nullable: false })
  firstEditionYear: number

  @Column({ type: 'int', nullable: false })
  typeId: number

  @ManyToOne(() => FestivalType, { nullable: false, eager: false, onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'typeId' })
  type: FestivalType

  @Column({ type: 'varchar', length: 255, nullable: true })
  website: string | null

  @Column({ type: 'varchar', length: 255, nullable: false })
  theme: string

  @Column({ type: 'text' })
  description: string

  @Column({ type: 'text', nullable: true })
  descriptionEn: string | null

  @Column({ type: 'int', nullable: false })
  classificationId: number

  @ManyToOne(() => FestivalClassification, { nullable: false, eager: false, onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'classificationId' })
  classification: FestivalClassification

  @Column({ type: 'varchar', length: 255, nullable: false })
  contactName: string

  @Column({ type: 'varchar', length: 255, nullable: false })
  contactEmail: string

  @Column({ type: 'varchar', length: 50, nullable: false })
  contactPhone: string

  @Column({ type: 'int', nullable: true })
  posterId: number | null

  @ManyToOne(() => Asset, {
    nullable: true,
    eager: false,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'posterId' })
  poster: Asset | null

  @Column({ type: 'varchar', length: 500, nullable: true })
  trailer: string | null

  @Column({ type: 'text', nullable: true })
  needs: string | null

  @Column({ type: 'text', nullable: true })
  needsEn: string | null

  @Column({ type: 'int', nullable: true })
  dossierEsId: number | null

  @ManyToOne(() => Asset, {
    nullable: true,
    eager: false,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'dossierEsId' })
  dossierEs: Asset | null

  @Column({ type: 'int', nullable: true })
  dossierEnId: number | null

  @ManyToOne(() => Asset, {
    nullable: true,
    eager: false,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'dossierEnId' })
  dossierEn: Asset | null

  @Column({ type: 'boolean', default: false })
  hasCall: boolean

  @Column({ type: 'text', nullable: true })
  callProcess: string | null

  @Column({ type: 'varchar', length: 500, nullable: true })
  callLink: string | null

  @Column({ type: 'int', nullable: true })
  createdById: number | null

  @Column({ type: 'int', nullable: true })
  updatedById: number | null

  @Column({ type: 'boolean', default: true })
  isActive: boolean

  @OneToMany(() => FestivalCity, (festivalCity) => festivalCity.festival)
  hostCitiesRelations: FestivalCity[]

  @OneToMany(
    () => FestivalModality,
    (festivalModality) => festivalModality.festival,
  )
  modalities: FestivalModality[]

  @OneToMany(
    () => FestivalCompany,
    (festivalCompany) => festivalCompany.festival,
  )
  companies: FestivalCompany[]

  @OneToMany(
    () => FestivalProfessional,
    (festivalProfessional) => festivalProfessional.festival,
  )
  professionals: FestivalProfessional[]

  @OneToMany(() => FestivalStill, (festivalStill) => festivalStill.festival)
  stills: FestivalStill[]

  @OneToMany(
    () => FestivalSection,
    (festivalSection) => festivalSection.festival,
  )
  sections: FestivalSection[]

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
