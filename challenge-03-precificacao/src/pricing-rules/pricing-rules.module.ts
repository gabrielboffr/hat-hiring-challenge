import { Module } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { PricingRulesController } from './pricing-rules.controller';
import { PricingRulesService } from './pricing-rules.service';
import { PricingRulesRepository } from './pricing-rules.repository';

@Module({
  imports: [],
  controllers: [PricingRulesController],
  providers: [PricingRulesService, PricingRulesRepository, PrismaService],
})
export class PricingRulesModule {}
