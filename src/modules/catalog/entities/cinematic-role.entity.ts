import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm'
import { RoleCategory } from './role-category.entity'

@Entity('cinematic_roles')
export class CinematicRole {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ type: 'integer', nullable: false })
  idRoleCategory: number

  @ManyToOne(() => RoleCategory, (category) => category.roles)
  @JoinColumn({ name: 'idRoleCategory' })
  roleCategory: RoleCategory

  @Column({ type: 'varchar', length: 100 })
  name: string

  @Column({ type: 'varchar', length: 100 })
  nameEn: string
}
