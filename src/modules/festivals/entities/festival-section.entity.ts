import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { Festival } from './festival.entity'

@Entity('festival_sections')
export class FestivalSection {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ type: 'integer', nullable: false })
  festivalId: number

  @ManyToOne(() => Festival, (festival) => festival.sections, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'festivalId' })
  festival: Festival

  @Column({ type: 'varchar', length: 255, nullable: false })
  name: string

  @Column({ type: 'boolean', default: false, nullable: false })
  competitive: boolean
}
