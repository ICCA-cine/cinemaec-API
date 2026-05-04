import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { Festival } from './festival.entity'
import { Company } from '../../companies/entities/company.entity'

@Entity('festival_companies')
@Index('UQ_festival_companies_festival_company', ['festivalId', 'companyId'], {
  unique: true,
})
export class FestivalCompany {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ type: 'integer', nullable: false })
  festivalId: number

  @ManyToOne(() => Festival, (festival) => festival.companies, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'festivalId' })
  festival: Festival

  @Column({ type: 'integer', nullable: false })
  companyId: number

  @ManyToOne(() => Company, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'companyId' })
  company: Company
}
