import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'
import { Asset } from '../../assets/entities/asset.entity'
import { Movie } from '../../movies/entities/movie.entity'
import { Festival } from '../../festivals/entities/festival.entity'
import { Professional } from '../../professionals/entities/professional.entity'

@Entity('admin_catalogs')
export class AdminCatalog {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ type: 'varchar', length: 255, nullable: false })
  name: string

  @Column({ type: 'int', nullable: false })
  year: number

  @Column({ type: 'int', nullable: false })
  imageId: number

  @ManyToOne(() => Asset, { nullable: false, onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'imageId' })
  imageAsset: Asset

  @Column({ type: 'text', nullable: true })
  description: string | null

  @Column({ type: 'boolean', default: true })
  isActive: boolean

  @Column({ type: 'int', nullable: true })
  createdById: number | null

  @Column({ type: 'int', nullable: true })
  updatedById: number | null

  @ManyToMany(() => Movie, { cascade: false, eager: false })
  @JoinTable({
    name: 'catalog_movies',
    joinColumn: { name: 'catalogId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'movieId', referencedColumnName: 'id' },
  })
  movies: Movie[]

  @ManyToMany(() => Festival, { cascade: false, eager: false })
  @JoinTable({
    name: 'catalog_festivals',
    joinColumn: { name: 'catalogId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'festivalId', referencedColumnName: 'id' },
  })
  festivals: Festival[]

  @ManyToMany(() => Professional, { cascade: false, eager: false })
  @JoinTable({
    name: 'catalog_professionals',
    joinColumn: { name: 'catalogId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'professionalId', referencedColumnName: 'id' },
  })
  professionals: Professional[]

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
