import { Module } from '@nestjs/common';
import { ProposalsModule } from './proposals/proposals.module';
import { ProfessionalsModule } from './professionals/professionals.module';
import { PricingRulesModule } from './pricing-rules/pricing-rules.module';

@Module({
  imports: [ProposalsModule, ProfessionalsModule, PricingRulesModule],
})
export class AppModule {}
