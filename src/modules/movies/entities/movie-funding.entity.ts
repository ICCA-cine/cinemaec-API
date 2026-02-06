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
import { MovieFundingStage } from '../enums/movie-funding-stage.enum'

@Entity('movie_funding')
export class MovieFunding {
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

  @Column({ type: 'numeric', precision: 12, scale: 2, nullable: true })
  amountGranted: number | null

  @Column({ type: 'enum', enum: MovieFundingStage, nullable: false })
  fundingStage: MovieFundingStage

  @CreateDateColumn()
  createdAt: Date
}
