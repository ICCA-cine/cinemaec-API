import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm'
import { Movie } from './movie.entity'
import { Country } from '../../catalog/entities/country.entity'
import { MovieReleaseType } from '../enums/movie-release-type.enum'

@Entity('movie_international_releases')
export class MovieInternationalRelease {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ type: 'integer', nullable: false })
  movieId: number

  @ManyToOne(() => Movie)
  @JoinColumn({ name: 'movieId' })
  movie: Movie

  @Column({ type: 'integer', nullable: false })
  countryId: number

  @ManyToOne(() => Country)
  @JoinColumn({ name: 'countryId' })
  country: Country

  @Column({ type: 'integer', nullable: false })
  year: number

  @Column({ type: 'varchar', length: 255, nullable: true })
  spaceName: string | null

  @Column({ type: 'varchar', enum: MovieReleaseType, nullable: false })
  type: MovieReleaseType
}
