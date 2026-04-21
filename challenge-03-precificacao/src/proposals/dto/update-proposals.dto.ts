import { PartialType } from '@nestjs/swagger';
import { CreateProposalsDto } from './create-proposals.dto';
import { Decimal } from '@prisma/client/runtime/client';

export class UpdateProposalDto extends PartialType(CreateProposalsDto) {
  totalCost: Decimal;
  totalRevenue: Decimal;
}
