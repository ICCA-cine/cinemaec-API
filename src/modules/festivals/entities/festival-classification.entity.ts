import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity('festival_classifications')
export class FestivalClassification {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ type: 'varchar', length: 100, unique: true })
  code: string

  @Column({ type: 'varchar', length: 150 })
  name: string
}
