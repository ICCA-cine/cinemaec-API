import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from 'typeorm'
import { Movie } from '../../movies/entities/movie.entity'

@Entity('subgenres')
export class SubGenre {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ type: 'varchar', length: 100, unique: true })
  name: string

  @ManyToMany(() => Movie, (movie) => movie.subgenres)
  movies: Movie[]
}
