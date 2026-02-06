import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm'
import { Movie } from './movie.entity'

export enum ContactRole {
  DIRECTOR = 'Director/a',
  PRODUCER = 'Productor/a',
  SALES_AGENT = 'Agente de ventas',
  DISTRIBUTOR = 'Distribuidor/a',
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

  @Column({ type: 'varchar', length: 255, nullable: true })
  name: string | null

  @Column({
    type: 'enum',
    enum: ContactRole,
    nullable: false,
  })
  role: ContactRole

  @Column({ type: 'varchar', length: 50, nullable: true })
  phone: string | null

  @Column({ type: 'varchar', length: 255, nullable: true })
  email: string | null
}
