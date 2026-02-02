import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm'
import { Movie } from './movie.entity'
import { Fund } from '../../funds/entities/fund.entity'
import { FestivalNominationResult } from '../enums/festival-nomination-result.enum'

@Entity('movie_festival_nominations')
export class MovieFestivalNomination {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ type: 'integer', nullable: false })
  movieId: number

  @ManyToOne(() => Movie)
  @JoinColumn({ name: 'movieId' })
  movie: Movie

  @Column({ type: 'integer', nullable: false })
  fundId: number

  @ManyToOne(() => Fund)
  @JoinColumn({ name: 'fundId' })
  fund: Fund

  @Column({ type: 'integer', nullable: false })
  year: number

  @Column({ type: 'varchar', length: 255, nullable: false })
  category: string

  @Column({ type: 'varchar', enum: FestivalNominationResult, nullable: false })
  result: FestivalNominationResult

  @CreateDateColumn()
  createdAt: Date
}
