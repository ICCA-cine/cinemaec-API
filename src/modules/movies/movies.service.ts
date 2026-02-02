import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Movie } from './entities/movie.entity'
import { MovieProfessional } from './entities/movie-professional.entity'
import { UpdateMovieCastCrewDto } from './dto/update-cast-crew.dto'
import { CinematicRole } from '../catalog/entities/cinematic-role.entity'

@Injectable()
export class MoviesService {
  constructor(
    @InjectRepository(Movie)
    private readonly movieRepository: Repository<Movie>,
    @InjectRepository(MovieProfessional)
    private readonly movieProfessionalRepository: Repository<MovieProfessional>,
    @InjectRepository(CinematicRole)
    private readonly cinematicRoleRepository: Repository<CinematicRole>,
  ) {}

  // Placeholder for future movie creation logic
  async findAll(): Promise<Movie[]> {
    return this.movieRepository.find({
      relations: ['languages', 'country', 'provinces', 'cities'],
    })
  }

  async findOne(id: number): Promise<Movie> {
    const movie = await this.movieRepository.findOne({
      where: { id },
      relations: [
        'languages',
        'country',
        'provinces',
        'cities',
        'professionals',
        'professionals.professional',
      ],
    })

    if (!movie) {
      throw new NotFoundException(`Movie with ID ${id} not found`)
    }

    return movie
  }

  private async getCinematicRoleIdByName(name: string): Promise<number> {
    const role = await this.cinematicRoleRepository.findOne({
      where: { name },
    })

    if (!role) {
      throw new NotFoundException(`Cinematic role with name ${name} not found`)
    }

    return role.id
  }

  async updateCastCrew(
    movieId: number,
    updateCastCrewDto: UpdateMovieCastCrewDto,
  ): Promise<Movie> {
    // Verify movie exists
    await this.findOne(movieId)

    const directorRoleId = await this.getCinematicRoleIdByName('Director/a/e')
    const producerRoleId = await this.getCinematicRoleIdByName('Productor/a/e')

    // Update directors
    if (updateCastCrewDto.directors !== undefined) {
      // Remove existing directors
      await this.movieProfessionalRepository.delete({
        movieId,
        cinematicRoleId: directorRoleId,
      })

      // Add new directors
      if (updateCastCrewDto.directors.length > 0) {
        const directorsToAdd = updateCastCrewDto.directors.map(
          (professionalId) => {
            return this.movieProfessionalRepository.create({
              movieId,
              professionalId,
              cinematicRoleId: directorRoleId,
            })
          },
        )
        await this.movieProfessionalRepository.save(directorsToAdd)
      }
    }

    // Update producers
    if (updateCastCrewDto.producers !== undefined) {
      // Remove existing producers
      await this.movieProfessionalRepository.delete({
        movieId,
        cinematicRoleId: producerRoleId,
      })

      // Add new producers
      if (updateCastCrewDto.producers.length > 0) {
        const producersToAdd = updateCastCrewDto.producers.map(
          (professionalId) => {
            return this.movieProfessionalRepository.create({
              movieId,
              professionalId,
              cinematicRoleId: producerRoleId,
            })
          },
        )
        await this.movieProfessionalRepository.save(producersToAdd)
      }
    }

    return this.findOne(movieId)
  }

  async getProfessionalsByRole(
    movieId: number,
    cinematicRoleId: number,
  ): Promise<MovieProfessional[]> {
    return this.movieProfessionalRepository.find({
      where: { movieId, cinematicRoleId },
      relations: ['professional'],
    })
  }
}
