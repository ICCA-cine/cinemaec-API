import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm'
import { Country } from '../../catalog/entities/country.entity'

@Entity('exhibition_spaces')
export class ExhibitionSpace {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ type: 'varchar', length: 255, nullable: false })
  name: string

  @Column({ type: 'integer', nullable: false })
  countryId: number

  @ManyToOne(() => Country, { eager: true })
  @JoinColumn({ name: 'countryId' })
  country: Country
}
