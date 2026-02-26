import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm'
import { Movie } from './movie.entity'
import { User } from '../../users/entities/user.entity'
import { Asset } from '../../assets/entities/asset.entity'

export enum MovieClaimRequestStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

@Entity('movie_claim_requests')
export class MovieClaimRequest {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ type: 'integer', nullable: false })
  movieId: number

  @ManyToOne(() => Movie, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'movieId' })
  movie: Movie

  @Column({ type: 'integer', nullable: false })
  claimantUserId: number

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'claimantUserId' })
  claimantUser: User

  @Column({ type: 'integer', nullable: false })
  supportDocumentAssetId: number

  @ManyToOne(() => Asset, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'supportDocumentAssetId' })
  supportDocumentAsset: Asset

  @Column({
    type: 'enum',
    enum: MovieClaimRequestStatus,
    default: MovieClaimRequestStatus.PENDING,
  })
  status: MovieClaimRequestStatus

  @Column({ type: 'text', nullable: true })
  observation: string | null

  @Column({ type: 'integer', nullable: true })
  reviewedByUserId: number | null

  @ManyToOne(() => User, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'reviewedByUserId' })
  reviewedByUser: User | null

  @Column({ type: 'timestamp', nullable: true })
  reviewedAt: Date | null

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
