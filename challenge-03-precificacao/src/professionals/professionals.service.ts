import { Injectable, NotFoundException } from '@nestjs/common';
import { ProfessionalsRepository } from './professionals.repository';
import { CreateProfessionalDto } from './dto/create-professional.dto';

@Injectable()
export class ProfessionalsService {
  constructor(
    private readonly professionalsRepository: ProfessionalsRepository,
  ) {}

  async create(body: CreateProfessionalDto) {
    const pricingTable =
      await this.professionalsRepository.getPricingBySeniority(body.seniority);

    if (!pricingTable?.costPerHour && !pricingTable?.billRatePerHour) {
      throw new NotFoundException(
        `Tabela de preços não encontrada para a senioridade ${body.seniority}`,
      );
    }

    return this.professionalsRepository.create({
      ...body,
      costPerHour: pricingTable.costPerHour,
      billRatePerHour: pricingTable.billRatePerHour,
    });
  }

  async findAll() {
    return this.professionalsRepository.findAll();
  }
}
