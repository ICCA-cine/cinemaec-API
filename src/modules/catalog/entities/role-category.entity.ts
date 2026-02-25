import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm'
import { CinematicRole } from './cinematic-role.entity'

@Entity('role_categories')
export class RoleCategory {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ type: 'varchar', length: 100 })
  name: string

  @Column({ type: 'varchar', length: 100 })
  nameEn: string

  @OneToMany(() => CinematicRole, (role) => role.roleCategory)
  roles: CinematicRole[]
}
