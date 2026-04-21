import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { CreateProfessionalDto } from './dto/create-professional.dto';
import { Prisma, Seniority, type PrismaClient } from '@prisma/client';

@Injectable()
export class ProfessionalsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(body: CreateProfessionalDto) {
    return this.prisma.professionals.create({ data: { ...body } });
  }

  async getPricingBySeniority(seniority: Seniority) {
    return this.prisma.pricingTable.findFirst({
      where: {
        seniority: seniority,
      },
    });
  }

  async findAll() {
    return this.prisma.professionals.findMany();
  }

  async findByName(name: string) {
    return this.prisma.professionals.findFirst({ where: { name } });
  }

  async findById(id: string) {
    return this.prisma.professionals.findFirst({
      where: { id },
    });
  }
}
