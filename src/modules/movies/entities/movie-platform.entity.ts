import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm'
import { Movie } from './movie.entity'
import { Platform } from '../../platforms/entities/platform.entity'

@Entity('movie_platforms')
export class MoviePlatform {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ type: 'integer', nullable: false })
  movieId: number

  @ManyToOne(() => Movie)
  @JoinColumn({ name: 'movieId' })
  movie: Movie

  @Column({ type: 'integer', nullable: false })
  platformId: number

  @ManyToOne(() => Platform)
  @JoinColumn({ name: 'platformId' })
  platform: Platform

  @Column({ type: 'varchar', length: 500, nullable: true })
  link: string | null

  @CreateDateColumn()
  createdAt: Date
}
