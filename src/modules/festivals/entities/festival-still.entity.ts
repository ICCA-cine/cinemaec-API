import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { Festival } from './festival.entity'
import { Asset } from '../../assets/entities/asset.entity'

@Entity('festival_stills')
@Index('UQ_festival_stills_festival_asset', ['festivalId', 'assetId'], {
  unique: true,
})
export class FestivalStill {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ type: 'integer', nullable: false })
  festivalId: number

  @ManyToOne(() => Festival, (festival) => festival.stills, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'festivalId' })
  festival: Festival

  @Column({ type: 'integer', nullable: false })
  assetId: number

  @ManyToOne(() => Asset, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'assetId' })
  asset: Asset
}
