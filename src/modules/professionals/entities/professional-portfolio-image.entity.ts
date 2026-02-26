import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm'
import { Professional } from './professional.entity'
import { Asset } from '../../assets/entities/asset.entity'

@Entity('professional_portfolio_images')
export class ProfessionalPortfolioImage {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ type: 'integer', nullable: false })
  professionalId: number

  @ManyToOne(() => Professional, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'professionalId' })
  professional: Professional

  @Column({ type: 'integer', nullable: false })
  assetId: number

  @ManyToOne(() => Asset, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'assetId' })
  asset: Asset

  @CreateDateColumn()
  createdAt: Date
}
