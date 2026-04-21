import { Module } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { ProposalsRepository } from './proposals.repository';
import { ProposalsService } from './proposals.service';
import { ProposalsController } from './proposals.controller';
import { ProfessionalsRepository } from 'src/professionals/professionals.repository';
import { PricingRulesRepository } from 'src/pricing-rules/pricing-rules.repository';

@Module({
  imports: [],
  controllers: [ProposalsController],
  providers: [
    PrismaService,
    ProposalsService,
    ProposalsRepository,
    ProfessionalsRepository,
    PricingRulesRepository,
  ],
})
export class ProposalsModule {}
