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

export enum ContactPosition {
  PRODUCER_COMPANY = 'Productora',
  DIRECTOR = 'Director',
  SALES_AGENT = 'Agente de ventas',
  DISTRIBUTOR = 'Distribuidor',
}

@Entity('movie_contacts')
export class MovieContact {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ type: 'integer', nullable: false })
  movieId: number

  @ManyToOne(() => Movie)
  @JoinColumn({ name: 'movieId' })
  movie: Movie

  @Column({ type: 'integer', nullable: false })
  professionalId: number

  @ManyToOne(() => Professional)
  @JoinColumn({ name: 'professionalId' })
  professional: Professional

  @Column({
    type: 'enum',
    enum: ContactPosition,
    nullable: false,
  })
  cargo: ContactPosition

  @CreateDateColumn()
  createdAt: Date
}
