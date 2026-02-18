import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm'
import { User } from '../../users/entities/user.entity'
import { MovieCompany } from '../../movies/entities/movie-company.entity'

@Entity('companies')
export class Company {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ type: 'varchar', length: 255 })
  name: string

  @Column({ type: 'varchar', length: 13, nullable: true, unique: true })
  ruc: string | null

  @Column({ type: 'varchar', length: 255, nullable: true })
  representative: string | null

  @Column({ type: 'varchar', length: 20, nullable: true })
  representativeDniNumber: string | null

  @Column({ type: 'varchar', length: 20, nullable: true })
  phone: string | null

  @Column({ type: 'varchar', length: 10, nullable: true })
  mobile: string | null

  @Column({ type: 'varchar', length: 255, nullable: true })
  website: string | null

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

  @Column({ type: 'boolean', default: false })
  isActive: boolean

  @Column({ type: 'varchar', length: 20, default: 'inactive' })
  status: string

  @CreateDateColumn()
  createdAt: Date

  @Column({ type: 'timestamp', nullable: true, default: null })
  updatedAt: Date | null
}
