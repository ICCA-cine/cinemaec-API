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

export enum Gender {
  MASCULINO = 'masculino',
  FEMENINO = 'femenino',
}

export enum ProfessionalStatusEnum {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  VERIFIED = 'verified',
  PENDING_VERIFICATION = 'pending_verification',
  SUSPENDED = 'suspended',
}

@Entity('professionals')
export class Professional {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ type: 'varchar', length: 255 })
  name: string

  @Column({ type: 'varchar', length: 100, nullable: true })
  firstName: string | null

  @Column({ type: 'varchar', length: 100, nullable: true })
  lastName: string | null

  @Column({ type: 'varchar', length: 20, nullable: true })
  cedula: string | null

  @Column({ type: 'varchar', length: 20, nullable: true })
  idNumber: string | null

  @Column({
    type: 'enum',
    enum: Gender,
    nullable: true,
  })
  gender: Gender | null

  @Column({ type: 'varchar', length: 255, nullable: true })
  email: string | null

  @Column({ type: 'varchar', length: 20, nullable: true })
  phone: string | null

  @Column({ type: 'varchar', length: 20, nullable: true })
  telefono: string | null

  @Column({ type: 'varchar', length: 20, nullable: true })
  celular: string | null

  @Column({ type: 'varchar', length: 255, nullable: true })
  sitioWeb: string | null

  @Column({ type: 'varchar', length: 255, nullable: true })
  linkedin: string | null

  @Column({ type: 'integer', nullable: true })
  ownerId: number | null

  @ManyToOne(() => User, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'ownerId' })
  owner: User | null

  @Column({ type: 'boolean', default: true })
  isActive: boolean

  @Column({
    type: 'enum',
    enum: ProfessionalStatusEnum,
    default: ProfessionalStatusEnum.ACTIVE,
  })
  status: ProfessionalStatusEnum

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
