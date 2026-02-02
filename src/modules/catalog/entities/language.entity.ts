import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from 'typeorm'
import { Movie } from '../../movies/entities/movie.entity'

@Entity('languages')
export class Language {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ type: 'varchar', length: 10, unique: true })
  code: string

  @Column({ type: 'varchar', length: 100 })
  name: string

  @ManyToMany(() => Movie, (movie) => movie.languages)
  movies: Movie[]
}
