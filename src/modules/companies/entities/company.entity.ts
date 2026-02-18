import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm'
import { Country } from '../../catalog/entities/country.entity'
import { User } from '../../users/entities/user.entity'

@Entity('companies')
export class Company {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ type: 'varchar', length: 255 })
  nombre: string

  @Column({ type: 'varchar', length: 13, nullable: true })
  ruc: string | null

  @Column({ type: 'varchar', length: 255, nullable: true })
  representante: string | null

  @Column({ type: 'varchar', length: 20, nullable: true })
  cedulaRepresentante: string | null

  @Column({ type: 'varchar', length: 20, nullable: true })
  telefono: string | null

  @Column({ type: 'varchar', length: 20, nullable: true })
  celular: string | null

  @Column({ type: 'varchar', length: 255, nullable: true })
  sitioWeb: string | null

  @Column({ type: 'varchar', length: 255, nullable: true })
  instagram: string | null

  @Column({ type: 'varchar', length: 255, nullable: true })
  linkedin: string | null

  @ManyToOne(() => Country)
  @JoinColumn({ name: 'countryId' })
  country: Country

  @Column({ type: 'integer' })
  countryId: number

  @Column({ type: 'integer', nullable: true })
  ownerId: number | null

  @ManyToOne(() => User, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'ownerId' })
  owner: User | null

  @Column({ type: 'boolean', default: false })
  isActive: boolean

  @CreateDateColumn()
  createdAt: Date
}
