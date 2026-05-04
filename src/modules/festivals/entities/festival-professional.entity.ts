import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { Festival } from './festival.entity'
import { Professional } from '../../professionals/entities/professional.entity'

export enum FestivalProfessionalRole {
  DIRECTOR = 'director',
  PRODUCER = 'producer',
  PROGRAMMER = 'programmer',
}

@Entity('festival_professionals')
@Index(
  'UQ_festival_professionals_festival_prof_role',
  ['festivalId', 'professionalId', 'role'],
  {
    unique: true,
  },
)
export class FestivalProfessional {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ type: 'integer', nullable: false })
  festivalId: number

  @ManyToOne(() => Festival, (festival) => festival.professionals, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'festivalId' })
  festival: Festival

  @Column({ type: 'integer', nullable: false })
  professionalId: number

  @ManyToOne(() => Professional, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'professionalId' })
  professional: Professional

  @Column({
    type: 'enum',
    enum: FestivalProfessionalRole,
    nullable: false,
  })
  role: FestivalProfessionalRole
}
