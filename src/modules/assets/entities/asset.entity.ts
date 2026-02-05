import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm'
import { User } from '../../users/entities/user.entity'

export enum AssetTypeEnum {
  IMAGE = 'image',
  VIDEO = 'video',
  DOCUMENT = 'document',
  LOGO = 'logo',
  OTHER = 'other',
}

export enum AssetOwnerEnum {
  SPACE_LOGO = 'space_logo',
  SPACE_PHOTO = 'space_photo',
  SPACE_DOCUMENT = 'space_document',
  USER_BC_PHOTO = 'user_bc_photo',
  USER_AGREEMENT = 'user_agreement',
  COMPANY_LOGO = 'company_logo',
  COMPANY_PHOTOS = 'company_photos',
  LOCATION_PHOTOS = 'location_photos',
  MOVIE_STILLS = 'movie_stills',
  MOVIE_POSTER = 'movie_poster',
  MOVIE_DOSSIER = 'movie_dossier',
  MOVIE_DOSSIER_EN = 'movie_dossier_en',
  MOVIE_PEDAGOGICAL_GUIDE = 'movie_pedagogical_guide',
}

@Entity('assets')
export class Asset {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ type: 'int', nullable: false })
  userId: number

  @Column({
    type: 'enum',
    enum: AssetTypeEnum,
    nullable: false,
  })
  documentType: AssetTypeEnum

  @Column({
    type: 'enum',
    enum: AssetOwnerEnum,
    nullable: false,
  })
  ownerType: AssetOwnerEnum

  @Column({ type: 'int', nullable: true })
  ownerId: number | null

  @ManyToOne(() => User, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'ownerId' })
  owner: User | null

  @Column({ type: 'text', nullable: false })
  url: string

  @Column({ type: 'text', nullable: true })
  firebasePath: string | null

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User

  @UpdateDateColumn()
  updatedAt: Date

  @CreateDateColumn()
  createdAt: Date
}
