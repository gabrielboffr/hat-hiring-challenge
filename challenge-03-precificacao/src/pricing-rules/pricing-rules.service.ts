import { Injectable } from '@nestjs/common';
import { PricingRulesRepository } from './pricing-rules.repository';
import { ApproverLevel } from '@prisma/client';

@Injectable()
export class PricingRulesService {
  constructor(
    private readonly pricingRulesRepository: PricingRulesRepository,
  ) {}

  async getPricingTable() {
    return this.pricingRulesRepository.getPricingTable();
  }

  async getDiscountTable() {
    return this.pricingRulesRepository.getDiscountTable();
  }

  async getMaxAllowedDiscount(approverLevel: ApproverLevel) {
    return this.pricingRulesRepository.getMaxAllowedDiscount(approverLevel);
  }
}
