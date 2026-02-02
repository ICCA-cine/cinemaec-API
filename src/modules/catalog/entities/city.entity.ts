import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  ManyToMany,
} from 'typeorm'
import { Province } from './province.entity'
import { Movie } from '../../movies/entities/movie.entity'

@Entity('cities')
export class City {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ type: 'varchar', length: 100 })
  name: string

  @ManyToOne(() => Province, (province) => province.cities, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  province: Province

  @ManyToMany(() => Movie, (movie) => movie.cities)
  movies: Movie[]
}
