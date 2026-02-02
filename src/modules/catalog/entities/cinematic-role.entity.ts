import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm'

@Entity('cinematic_roles')
export class CinematicRole {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ type: 'varchar', length: 100, unique: true })
  name: string
}
