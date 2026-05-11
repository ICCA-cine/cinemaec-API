import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'

@Entity('contact_us_messages')
export class ContactUsMessage {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ type: 'varchar', length: 150, nullable: false })
  name: string

  @Column({ type: 'varchar', length: 255, nullable: true })
  institution?: string | null

  @Column({ type: 'varchar', length: 255, nullable: false })
  email: string

  @Column({ type: 'varchar', length: 30, nullable: true })
  phone?: string | null

  @Column({ type: 'varchar', length: 300, nullable: false })
  message: string

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date
}