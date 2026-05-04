import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { Festival } from './festival.entity'
import { City } from '../../catalog/entities/city.entity'

@Entity('festival_cities')
@Index('UQ_festival_cities_festival_city', ['festivalId', 'cityId'], {
  unique: true,
})
export class FestivalCity {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ type: 'integer', nullable: false })
  festivalId: number

  @ManyToOne(() => Festival, (festival) => festival.hostCitiesRelations, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'festivalId' })
  festival: Festival

  @Column({ type: 'integer', nullable: false })
  cityId: number

  @ManyToOne(() => City, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'cityId' })
  city: City

  @Column({ type: 'boolean', default: false, nullable: false })
  isMainVenue: boolean
}
