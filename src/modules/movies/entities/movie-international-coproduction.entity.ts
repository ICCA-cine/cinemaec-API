import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm'
import { Movie } from './movie.entity'
import { Country } from '../../catalog/entities/country.entity'

@Entity('movies_international_coproductions')
export class MovieInternationalCoproduction {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ type: 'integer', nullable: false })
  movieId: number

  @ManyToOne(() => Movie)
  @JoinColumn({ name: 'movieId' })
  movie: Movie

  @Column({ type: 'varchar', length: 255, nullable: false })
  companyName: string

  @Column({ type: 'integer', nullable: false })
  countryId: number

  @ManyToOne(() => Country)
  @JoinColumn({ name: 'countryId' })
  country: Country
}
