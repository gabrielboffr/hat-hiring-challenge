import { Controller, Get } from '@nestjs/common';
import { PricingRulesService } from './pricing-rules.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('tabela')
@Controller()
export class PricingRulesController {
  constructor(private readonly pricingRulesService: PricingRulesService) {}

  @Get('tabela-precos')
  getPricingTable() {
    return this.pricingRulesService.getPricingTable();
  }

  @Get('tabela-descontos')
  getDiscountTable() {
    return this.pricingRulesService.getDiscountTable();
  }
}
