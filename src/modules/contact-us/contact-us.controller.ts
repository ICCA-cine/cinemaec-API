import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common'
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger'
import { CurrentUser, JwtPayload } from '../users/decorators/current-user.decorator'
import { JwtAuthGuard } from '../users/guards/jwt-auth.guard'
import { CreateContactUsDto } from './dto/create-contact-us.dto'
import { ContactUsService } from './contact-us.service'

@ApiTags('Contact Us')
@Controller('contact-us')
export class ContactUsController {
  constructor(private readonly contactUsService: ContactUsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Enviar mensaje de contacto' })
  @ApiResponse({ status: 201, description: 'Mensaje enviado exitosamente' })
  create(@Body() createContactUsDto: CreateContactUsDto) {
    return this.contactUsService.create(createContactUsDto)
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Listar mensajes de contacto (solo admin)' })
  @ApiResponse({ status: 200, description: 'Lista de mensajes de contacto' })
  @ApiResponse({ status: 403, description: 'Acceso denegado' })
  findAll(@CurrentUser() user: JwtPayload) {
    return this.contactUsService.findAll(user.userId ?? user.sub)
  }
}