import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm'
import { Movie } from './movie.entity'
import { Professional } from '../../professionals/entities/professional.entity'
import { CinematicRole } from '../../catalog/entities/cinematic-role.entity'

@Entity('movie_professionals')
export class MovieProfessional {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ type: 'integer', nullable: false })
  movieId: number

  @ManyToOne(() => Movie, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'movieId' })
  movie: Movie

  @Column({ type: 'integer', nullable: false })
  professionalId: number

  @ManyToOne(() => Professional, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'professionalId' })
  professional: Professional

  @Column({ type: 'integer', nullable: false })
  cinematicRoleId: number

  @ManyToOne(() => CinematicRole)
  @JoinColumn({ name: 'cinematicRoleId' })
  cinematicRole: CinematicRole

  @CreateDateColumn()
  createdAt: Date
}
