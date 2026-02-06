import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm'
import { Movie } from './movie.entity'
import { ExhibitionSpace } from '../../exhibition-spaces/entities/exhibition-space.entity'
import { City } from '../../catalog/entities/city.entity'
import { MovieReleaseType } from '../enums/movie-release-type.enum'

@Entity('movie_national_releases')
export class MovieNationalRelease {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ type: 'integer', nullable: false })
  movieId: number

  @ManyToOne(() => Movie)
  @JoinColumn({ name: 'movieId' })
  movie: Movie

  @Column({ type: 'integer', nullable: false })
  exhibitionSpaceId: number

  @ManyToOne(() => ExhibitionSpace)
  @JoinColumn({ name: 'exhibitionSpaceId' })
  exhibitionSpace: ExhibitionSpace

  @Column({ type: 'integer', nullable: false })
  cityId: number

  @ManyToOne(() => City)
  @JoinColumn({ name: 'cityId' })
  city: City

  @Column({ type: 'integer', nullable: false })
  year: number

  @Column({ type: 'varchar', enum: MovieReleaseType, nullable: false })
  type: MovieReleaseType
}
