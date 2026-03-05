import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm'
import { Asset } from '../../assets/entities/asset.entity'
import { PlatformType } from '../enums/platform-type.enum'
import { MoviePlatform } from '../../movies/entities/movie-platform.entity'

@Entity('platforms')
export class Platform {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ type: 'text', nullable: false })
  name: string

  @Column({ type: 'varchar', enum: PlatformType, nullable: false })
  type: PlatformType

  @Column({ type: 'integer', nullable: true })
  logoId: number

  @ManyToOne(() => Asset, { eager: true, nullable: true })
  @JoinColumn({ name: 'logoId' })
  logo: Asset

  @OneToMany(() => MoviePlatform, (moviePlatform) => moviePlatform.platform)
  movies: MoviePlatform[]
}
