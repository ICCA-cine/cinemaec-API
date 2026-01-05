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

export enum SpaceTypeEnum {
  THEATER = 'theater',
  CINEMA = 'cinema',
  CULTURAL_CENTER = 'cultural_center',
  MULTIPURPOSE = 'multipurpose',
  OTHER = 'other',
}

export enum SpaceStatusEnum {
  PENDING = 'pending',
  VERIFIED = 'verified',
  REJECTED = 'rejected',
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  UNDER_REVIEW = 'under_review',
}

@Entity('spaces')
export class Space {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ type: 'varchar', length: 255, nullable: false })
  name: string

  @Column({
    type: 'enum',
    enum: SpaceTypeEnum,
    nullable: false,
  })
  type: SpaceTypeEnum

  @Column({ type: 'varchar', length: 100, nullable: false })
  province: string

  @Column({ type: 'varchar', length: 100, nullable: false })
  city: string

  @Column({ type: 'varchar', length: 255, nullable: false })
  address: string

  @Column({ type: 'varchar', length: 255, nullable: false })
  email: string

  @Column({ type: 'varchar', length: 20, nullable: false })
  phone: string

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 7,
    array: true,
    nullable: false,
  })
  coordinates: number[]

  @Column({ type: 'text', nullable: false })
  description: string

  @Column({ type: 'text', array: true, nullable: false })
  target: string[]

  @Column({ type: 'varchar', length: 255, nullable: false })
  managerName: string

  @Column({ type: 'varchar', length: 20, nullable: false })
  managerPhone: string

  @Column({ type: 'varchar', length: 255, nullable: false })
  managerEmail: string

  @Column({ type: 'varchar', length: 255, nullable: false })
  technicianInCharge: string

  @Column({ type: 'varchar', length: 100, nullable: false })
  technicianRole: string

  @Column({ type: 'varchar', length: 20, nullable: false })
  technicianPhone: string

  @Column({ type: 'varchar', length: 255, nullable: false })
  technicianEmail: string

  @Column({ type: 'int', nullable: false })
  capacity: number

  @Column({ type: 'text', array: true, nullable: false })
  projectionEquipment: string[]

  @Column({ type: 'text', array: true, nullable: false })
  soundEquipment: string[]

  @Column({ type: 'text', array: true, nullable: false })
  screen: string[]

  @Column({ type: 'text', nullable: false })
  boxofficeRegistration: string

  @Column({ type: 'text', array: true, nullable: false })
  accessibilities: string[]

  @Column({ type: 'text', array: true, nullable: false })
  services: string[]

  @Column({ type: 'text', nullable: false })
  operatingHistory: string

  @Column({ type: 'text', nullable: false })
  mainActivity: string

  @Column({ type: 'text', array: true, nullable: false })
  otherActivities: string[]

  @Column({ type: 'text', array: true, nullable: false })
  commercialActivities: string[]

  @Column({ type: 'int', nullable: false })
  logoId: number

  @Column({ type: 'int', array: true, nullable: false })
  photosId: number[]

  @Column({ type: 'int', nullable: false })
  ciDocument: number

  @Column({ type: 'int', nullable: true })
  rucDocument: number | null

  @Column({ type: 'int', nullable: false })
  managerDocument: number

  @Column({ type: 'int', nullable: false })
  serviceBill: number

  @Column({ type: 'int', nullable: false })
  operatingLicense: number

  @Column({ type: 'int', nullable: true })
  contractId: number | null

  @Column({
    type: 'enum',
    enum: SpaceStatusEnum,
    default: SpaceStatusEnum.PENDING,
  })
  status: SpaceStatusEnum

  @Column({ type: 'int', nullable: false })
  userId: number

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User

  @UpdateDateColumn()
  updatedAt: Date

  @CreateDateColumn()
  createdAt: Date
}
