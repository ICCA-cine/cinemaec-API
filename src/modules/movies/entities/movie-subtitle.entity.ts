import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm'
import { Movie } from './movie.entity'
import { Language } from '../../catalog/entities/language.entity'

@Entity('movies_subtitles')
export class MovieSubtitle {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ type: 'integer', nullable: false })
  movieId: number

  @ManyToOne(() => Movie, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'movieId' })
  movie: Movie

  @Column({ type: 'integer', nullable: false })
  languageId: number

  @ManyToOne(() => Language, { onDelete: 'NO ACTION' })
  @JoinColumn({ name: 'languageId' })
  language: Language
}
