import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm'
import { Country } from '../../catalog/entities/country.entity'
import { User } from '../../users/entities/user.entity'
import { MovieCompany } from '../../movies/entities/movie-company.entity'

export enum CompanyStatusEnum {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  VERIFIED = 'verified',
  PENDING_VERIFICATION = 'pending_verification',
  REJECTED = 'rejected',
}

@Entity('companies')
export class Company {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ type: 'varchar', length: 255 })
  nombre: string

  @Column({ type: 'varchar', length: 13, nullable: true })
  ruc: string | null

  @Column({ type: 'varchar', length: 255, nullable: true })
  legalName: string | null

  @Column({ type: 'varchar', length: 255, nullable: true })
  commercialName: string | null

  @Column({ type: 'varchar', length: 255, nullable: true })
  representante: string | null

  @Column({ type: 'varchar', length: 20, nullable: true })
  cedulaRepresentante: string | null

  @ManyToOne(() => Country)
  @JoinColumn({ name: 'countryId' })
  country: Country

  @Column({ type: 'integer' })
  countryId: number

  @Column({ type: 'varchar', length: 255, nullable: true })
  email: string | null

  @Column({ type: 'varchar', length: 20, nullable: true })
  phone: string | null

  @Column({ type: 'varchar', length: 20, nullable: true })
  telefono: string | null

  @Column({ type: 'varchar', length: 20, nullable: true })
  celular: string | null

  @Column({ type: 'varchar', length: 255, nullable: true })
  website: string | null

  @Column({ type: 'varchar', length: 255, nullable: true })
  sitioWeb: string | null

  @Column({ type: 'varchar', length: 255, nullable: true })
  instagram: string | null

  @Column({ type: 'varchar', length: 255, nullable: true })
  linkedin: string | null

  @Column({ type: 'integer', nullable: true })
  ownerId: number | null

  @ManyToOne(() => User, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'ownerId' })
  owner: User | null

  @OneToMany(() => MovieCompany, (movieCompany) => movieCompany.company)
  movies: MovieCompany[]

  @Column({ type: 'boolean', default: true })
  isActive: boolean

  @Column({
    type: 'enum',
    enum: CompanyStatusEnum,
    default: CompanyStatusEnum.ACTIVE,
  })
  status: CompanyStatusEnum

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
