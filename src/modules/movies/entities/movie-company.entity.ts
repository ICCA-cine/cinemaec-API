import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm'
import { Movie } from './movie.entity'
import { Company } from '../../companies/entities/company.entity'

export enum CompanyParticipationType {
  PRODUCER = 'Productor',
  CO_PRODUCER = 'Coproductor',
}

@Entity('movie_companies')
export class MovieCompany {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ type: 'integer', nullable: false })
  movieId: number

  @ManyToOne(() => Movie)
  @JoinColumn({ name: 'movieId' })
  movie: Movie

  @Column({ type: 'integer', nullable: false })
  companyId: number

  @ManyToOne(() => Company)
  @JoinColumn({ name: 'companyId' })
  company: Company

  @Column({
    type: 'enum',
    enum: CompanyParticipationType,
    nullable: false,
  })
  participation: CompanyParticipationType

  @CreateDateColumn()
  createdAt: Date
}
