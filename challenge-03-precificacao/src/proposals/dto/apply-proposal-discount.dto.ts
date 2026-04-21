import { ApproverLevel } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/client';

export class ApplyProposalDiscount {
  approverLevel: ApproverLevel;
  applyDiscount: Decimal;
}
