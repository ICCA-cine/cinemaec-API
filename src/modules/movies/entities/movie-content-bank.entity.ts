import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm'
import { Movie } from './movie.entity'
import { Country } from '../../catalog/entities/country.entity'
import { ExhibitionWindow } from '../enums/exhibition-window.enum'

@Entity('movie_content_bank')
export class MovieContentBank {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ type: 'integer', nullable: false })
  movieId: number

  @ManyToOne(() => Movie)
  @JoinColumn({ name: 'movieId' })
  movie: Movie

  @Column({ type: 'date', nullable: false })
  licensingStartDate: Date

  @Column({ type: 'date', nullable: false })
  licensingEndDate: Date

  @Column({
    type: 'enum',
    enum: ExhibitionWindow,
    nullable: false,
  })
  exhibitionWindow: ExhibitionWindow

  @Column({ type: 'integer', array: true, nullable: true })
  geolocationRestrictionCountryIds: number[] | null

  @CreateDateColumn()
  createdAt: Date
}
