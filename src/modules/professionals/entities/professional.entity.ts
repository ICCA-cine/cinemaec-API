import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm'
import { User } from '../../users/entities/user.entity'

@Entity('professionals')
@Index('IDX_professionals_owner_unique', ['ownerId'], {
  unique: true,
  where: '"ownerId" IS NOT NULL',
})
export class Professional {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ type: 'varchar', length: 255 })
  name: string

  @Column({ type: 'varchar', length: 20, nullable: true })
  dniNumber: string | null

  @Column({ type: 'varchar', length: 20, nullable: true })
  phone: string | null

  @Column({ type: 'varchar', length: 10, nullable: true })
  mobile: string | null

  @Column({ type: 'varchar', length: 255, nullable: true })
  website: string | null

  @Column({ type: 'varchar', length: 255, nullable: true })
  linkedin: string | null

  @Column({ type: 'integer', nullable: true })
  ownerId: number | null

  @ManyToOne(() => User, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'ownerId' })
  owner: User | null

  @Column({ type: 'boolean', default: false })
  isActive: boolean

  @Column({ type: 'varchar', length: 20, default: 'inactive' })
  status: string

  @CreateDateColumn()
  createdAt: Date

  @Column({ type: 'timestamp', nullable: true, default: null })
  updatedAt: Date | null
}
