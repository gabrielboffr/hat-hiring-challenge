import { Module } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { ProfessionalsController } from './professionals.controller';
import { ProfessionalsRepository } from './professionals.repository';
import { ProfessionalsService } from './professionals.service';

@Module({
  imports: [],
  controllers: [ProfessionalsController],
  providers: [ProfessionalsRepository, ProfessionalsService, PrismaService],
})
export class ProfessionalsModule {}
