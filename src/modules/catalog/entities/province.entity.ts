import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from 'typeorm'
import { Country } from './country.entity'
import { City } from './city.entity'

@Entity('provinces')
export class Province {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ type: 'varchar', length: 100 })
  name: string

  @ManyToOne(() => Country, (country) => country.provinces, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  country: Country

  @OneToMany(() => City, (city) => city.province)
  cities: City[]

}
