import { Injectable } from '@nestjs/common';
import { ApproverLevel } from '@prisma/client';
import { PrismaService } from 'src/database/prisma.service';
import { CreateDiscountDto } from './dto/create-discount.dto';
import { PrismaClient } from '@prisma/client/extension';

@Injectable()
export class PricingRulesRepository {
  constructor(private readonly prisma: PrismaService) {}

  async getPricingTable() {
    return this.prisma.pricingTable.findMany();
  }

  async getDiscountTable() {
    return this.prisma.discountTable.findMany();
  }

  async getMaxAllowedDiscount(approverLevel: ApproverLevel, tx?: PrismaClient) {
    const client = tx ?? this.prisma;
    const result = await client.discountTable.findFirst({
      where: { approverLevel },
      select: { maxAllowedDiscount: true },
    });
    return result?.maxAllowedDiscount ?? 0;
  }

  async createDiscount(body: CreateDiscountDto, tx?: PrismaClient) {
    const client = tx ?? this.prisma;
    return client.discountProposalApplied.create({ data: body });
  }

  async findExistingDiscount(id: string, tx?: PrismaClient) {
    const client = tx ?? this.prisma;
    const result = await client.discountProposalApplied.findFirst({
      where: { proposalId: id },
      orderBy: { approvedAt: 'desc' },
      select: { discountApplied: true },
    });
    return result?.discountApplied ?? 0;
  }

  async findFirstProposal(id: string, tx?: PrismaClient) {
    const client = tx ?? this.prisma;
    const result = await client.discountProposalApplied.findFirst({
      where: { proposalId: id },
      orderBy: { approvedAt: 'asc' },
      select: { originTotalRevenue: true },
    });
    return result?.originTotalRevenue ?? 0;
  }
}
