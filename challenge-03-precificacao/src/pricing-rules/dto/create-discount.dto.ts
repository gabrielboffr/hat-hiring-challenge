import { ApproverLevel } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/client';

export class CreateDiscountDto {
  approverLevel: ApproverLevel;
  discountApplied: Decimal;
  proposalId: string;
  originTotalRevenue: Decimal;
}
