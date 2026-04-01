import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger'
import { MoviesService } from './movies.service'
import { Movie } from './entities/movie.entity'

@ApiTags('Movies - Public')
@Controller('movies-public')
export class MoviesPublicController {
  constructor(private readonly moviesService: MoviesService) {}

  @Get('catalog')
  @ApiOperation({ summary: 'Obtener películas publicadas en catálogo público' })
  @ApiResponse({
    status: 200,
    description: 'Lista de películas en catálogo público',
    type: [Movie],
  })
  findPublicCatalog() {
    return this.moviesService.findPublicCatalog()
  }

  @Get('catalog/:id')
  @ApiOperation({ summary: 'Obtener detalles de una película del catálogo público' })
  @ApiResponse({
    status: 200,
    description: 'Película encontrada',
    type: Movie,
  })
  @ApiResponse({
    status: 404,
    description: 'Película no encontrada o no publicada',
  })
  findPublicById(@Param('id', ParseIntPipe) id: number) {
    return this.moviesService.findPublicById(id)
  }
}
