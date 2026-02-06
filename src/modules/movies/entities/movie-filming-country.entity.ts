import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm'
import { Movie } from './movie.entity'
import { Country } from '../../catalog/entities/country.entity'

@Entity('movie_filming_countries')
export class MovieFilmingCountry {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ type: 'integer', nullable: false })
  movieId: number

  @ManyToOne(() => Movie, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'movieId' })
  movie: Movie

  @Column({ type: 'integer', nullable: false })
  countryId: number

  @ManyToOne(() => Country, { onDelete: 'NO ACTION' })
  @JoinColumn({ name: 'countryId' })
  country: Country
}
