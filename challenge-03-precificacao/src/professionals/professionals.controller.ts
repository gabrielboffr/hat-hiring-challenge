import { Body, Controller, Get, Post } from '@nestjs/common';
import { ProfessionalsService } from './professionals.service';
import { CreateProfessionalDto } from './dto/create-professional.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('profissionais')
@Controller('profissionais')
export class ProfessionalsController {
  constructor(private readonly professionalsService: ProfessionalsService) {}

  @Post()
  create(@Body() dto: CreateProfessionalDto) {
    return this.professionalsService.create(dto);
  }

  @Get()
  findAll() {
    return this.professionalsService.findAll();
  }
}
