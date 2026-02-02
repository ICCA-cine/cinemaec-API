import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm'
import { Province } from './province.entity'
import { Movie } from '../../movies/entities/movie.entity'

@Entity('countries')
export class Country {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ type: 'varchar', length: 5, unique: true })
  code: string

  @Column({ type: 'varchar', length: 100 })
  name: string

  @OneToMany(() => Province, (province) => province.country)
  provinces: Province[]

  @OneToMany(() => Movie, (movie) => movie.country)
  movies: Movie[]
}
