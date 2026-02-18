import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm'
import { User } from '../../users/entities/user.entity'

@Entity('professionals')
export class Professional {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ type: 'varchar', length: 255 })
  name: string

  @Column({ type: 'varchar', length: 20, nullable: true })
  cedula: string | null

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

  @Column({ type: 'boolean', default: false })
  isActive: boolean

  @CreateDateColumn()
  createdAt: Date
}
