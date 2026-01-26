import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm'

export enum UserRole {
  ADMIN = 'admin',
  EDITOR = 'editor',
  USER = 'user',
}

export enum PermissionEnum {
  ADMIN_SPACES = 'admin_spaces',
  ADMIN_MOVIES = 'admin_movies',
  APPROVE_MOVIES_REQUEST = 'approve_movies_request',
  ADMIN_USERS = 'admin_users',
  ASSIGN_ROLES = 'assign_roles',
  VIEW_REPORTS = 'view_reports',
  EXPORT_DATA = 'export_data',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ type: 'varchar', length: 255, unique: true, nullable: false })
  email: string

  @Column({ type: 'varchar', length: 20, unique: true, nullable: false })
  cedula: string

  @Column({ type: 'varchar', length: 255, nullable: false, select: false })
  password: string

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.USER,
    nullable: false,
  })
  role: UserRole

  @Column({ type: 'boolean', default: false })
  isActive: boolean

  @Column({ type: 'varchar', nullable: true })
  emailVerificationToken: string | null

  @Column({ type: 'varchar', nullable: true })
  passwordResetToken: string | null

  @Column({ type: 'timestamp', nullable: true })
  passwordResetExpires: Date | null

  @Column({ type: 'int', nullable: true })
  profileId: number | null

  @Column({ type: 'timestamp', nullable: true })
  lastLogin: Date | null

  @Column({
    type: 'text',
    array: true,
    nullable: true,
    default: null,
  })
  permissions: string[] | null

  @CreateDateColumn()
  createdAt: Date
}
