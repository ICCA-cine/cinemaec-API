import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm'
import { FundType } from '../enums/fund-type.enum'
import { FinancialOrigin } from '../enums/financial-origin.enum'
import { Country } from '../../catalog/entities/country.entity'

@Entity('funds')
export class Fund {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ type: 'varchar', length: 255, nullable: false })
  name: string

  @Column({
    type: 'enum',
    enum: FundType,
    array: true,
    nullable: false,
  })
  type: FundType[]

  @Column({ type: 'integer', nullable: false })
  countryId: number

  @Column({
    type: 'enum',
    enum: FinancialOrigin,
    nullable: false,
  })
  financialOrigin: FinancialOrigin

  @ManyToOne(() => Country, { eager: true })
  @JoinColumn({ name: 'countryId' })
  country: Country
}
