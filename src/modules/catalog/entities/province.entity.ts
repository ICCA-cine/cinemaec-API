import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  ManyToMany,
} from 'typeorm'
import { Country } from './country.entity'
import { City } from './city.entity'
import { Movie } from '../../movies/entities/movie.entity'

@Entity('provinces')
export class Province {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ type: 'varchar', length: 100 })
  name: string

  @ManyToOne(() => Country, (country) => country.provinces, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  country: Country

  @OneToMany(() => City, (city) => city.province)
  cities: City[]

  @ManyToMany(() => Movie, (movie) => movie.provinces)
  movies: Movie[]
}
