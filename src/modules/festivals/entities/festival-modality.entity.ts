import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { Festival } from './festival.entity'

@Entity('festival_modalities')
@Index('UQ_festival_modalities_festival_value', ['festivalId', 'value'], {
  unique: true,
})
export class FestivalModality {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ type: 'integer', nullable: false })
  festivalId: number

  @ManyToOne(() => Festival, (festival) => festival.modalities, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'festivalId' })
  festival: Festival

  @Column({ type: 'varchar', length: 50, nullable: false })
  value: string
}
