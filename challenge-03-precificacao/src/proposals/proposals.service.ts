import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ProposalsRepository } from './proposals.repository';
import { CreateProposalsDto } from './dto/create-proposals.dto';
import { GetProposalsParams } from './dto/get-proposals-params.dto';
import { ProfessionalsRepository } from 'src/professionals/professionals.repository';
import { PrismaService } from 'src/database/prisma.service';
import { Prisma, Professionals } from '@prisma/client';
import { ApplyProposalDiscount } from './dto/apply-proposal-discount.dto';
import { PricingRulesRepository } from 'src/pricing-rules/pricing-rules.repository';

@Injectable()
export class ProposalsService {
  constructor(
    private readonly proposalsRepository: ProposalsRepository,
    private readonly professionalsRepository: ProfessionalsRepository,
    private readonly pricingRulesRepository: PricingRulesRepository,
    private readonly prisma: PrismaService,
  ) {}

  async create(body: CreateProposalsDto) {
    let totalCost = new Prisma.Decimal(0);
    let totalRevenue = new Prisma.Decimal(0);
    let grossMarginPct = new Prisma.Decimal(0);

    const professionalsWithInput = await Promise.all(
      body.professionals.map(async (prof) => {
        let professional: Professionals | null = null;

        if (prof.name) {
          professional = await this.professionalsRepository.findByName(
            prof.name,
          );
        }

        if (prof.id) {
          professional = await this.professionalsRepository.findById(prof.id);
        }

        if (!professional) {
          throw new BadRequestException(
            `Profissional não encontrado: ${prof.id || prof.name}`,
          );
        }

        if (!prof.estimatedHours) {
          throw new BadRequestException(
            `Você definiu o profissional ${prof.id || prof.name} sem horas estimadas`,
          );
        }

        const revenue = professional.billRatePerHour.mul(prof.estimatedHours);
        const cost = professional.costPerHour.mul(prof.estimatedHours);

        totalCost = totalCost.add(cost);
        totalRevenue = totalRevenue.add(revenue);

        return { prof, professional };
      }),
    );

    if (!totalRevenue.equals(0)) {
      grossMarginPct = totalRevenue
        .sub(totalCost)
        .div(totalRevenue)
        .mul(100)
        .toDecimalPlaces(2);
    }

    body.status = 'PENDING';

    if (grossMarginPct.lessThan(40)) {
      body.status = 'DENIED';
    }

    if (grossMarginPct.greaterThan(45)) {
      body.status = 'APPROVED';
    }

    return this.prisma.$transaction(async (tx) => {
      const proposal = await this.proposalsRepository.create(
        {
          client: body.client,
          description: body.description,
          startDate: new Date(body.startDate),
          endDate: new Date(body.endDate),
          totalCost,
          totalRevenue,
          grossMarginPct,
          status: body.status,
        },
        tx,
      );

      const links = professionalsWithInput.map(({ prof, professional }) => {
        return {
          proposalId: proposal.id,
          professionalId: professional.id,
          estimatedHours: prof.estimatedHours,
        };
      });

      await tx.proposalProfessional.createMany({ data: links });

      const payload = {
        id: proposal.id,
        client: body.client,
        status: body.status,
        totalCost,
        totalRevenue,
        grossMarginPct,
        breakdown: professionalsWithInput.map(({ prof, professional }) => ({
          name: professional.name,
          seniority: professional.seniority,
          hours: prof.estimatedHours,
          cost: professional.costPerHour.mul(prof.estimatedHours),
          sellingPrice: professional.billRatePerHour.mul(prof.estimatedHours),
        })),
      };

      return payload;
    });
  }

  async getProposals(params: GetProposalsParams) {
    return this.proposalsRepository.getProposals(params);
  }

  async findById(id: string) {
    const proposal = await this.proposalsRepository.findById(id);

    if (!proposal) {
      throw new NotFoundException('Proposta não encontrada');
    }

    const professionals = await this.prisma.proposalProfessional.findMany({
      where: { proposalId: id },
      include: { professional: true },
    });

    return {
      ...proposal,
      breakdown: professionals.map((prof) => ({
        name: prof.professional.name,
        seniority: prof.professional.seniority,
        hours: prof.estimatedHours,
        cost: prof.professional.costPerHour.mul(prof.estimatedHours),
        sellingPrice: prof.professional.billRatePerHour.mul(
          prof.estimatedHours,
        ),
      })),
    };
  }

  async applyDiscount(dto: ApplyProposalDiscount, id: string) {
    return this.prisma.$transaction(async (tx) => {
      const proposal = await this.proposalsRepository.findById(id, tx);
      const lastDiscount =
        await this.pricingRulesRepository.findExistingDiscount(id, tx);

      if (!proposal) {
        throw new NotFoundException(
          `A proposta de id: ${id} não foi encontrada.`,
        );
      }

      const maxAllowedDiscount =
        await this.pricingRulesRepository.getMaxAllowedDiscount(
          dto.approverLevel,
          tx,
        );
      const requestedDiscount = new Prisma.Decimal(dto.applyDiscount ?? 0);
      const accumulatedDiscount = requestedDiscount.add(
        new Prisma.Decimal(lastDiscount),
      );
      const maxAllowedDiscountDecimal = new Prisma.Decimal(maxAllowedDiscount);

      if (accumulatedDiscount.greaterThan(maxAllowedDiscountDecimal)) {
        throw new BadRequestException(
          `O nível de aprovador ${dto.approverLevel} não pode dar desconto maior que ${maxAllowedDiscountDecimal}%`,
        );
      }

      const firstTotalRevenue =
        await this.pricingRulesRepository.findFirstProposal(id, tx);

      const originTotalRevenue = proposal.totalRevenue.greaterThan(
        firstTotalRevenue,
      )
        ? proposal.totalRevenue
        : firstTotalRevenue;

      const totalRevenueWithDiscount = originTotalRevenue?.sub(
        originTotalRevenue.mul(accumulatedDiscount).div(100),
      );

      let newGrossMarginPct: Prisma.Decimal | null = null;

      if (
        proposal.totalCost !== null &&
        totalRevenueWithDiscount !== undefined
      ) {
        newGrossMarginPct = totalRevenueWithDiscount
          .sub(proposal.totalCost)
          .div(totalRevenueWithDiscount)
          .mul(100)
          .toDecimalPlaces(2);
      }

      if (newGrossMarginPct !== null) {
        if (newGrossMarginPct.lessThan(40)) {
          proposal.status = 'DENIED';
        } else if (newGrossMarginPct.greaterThan(45)) {
          proposal.status = 'APPROVED';
        } else {
          proposal.status = 'PENDING';
        }
      }

      const body = {
        totalRevenue: totalRevenueWithDiscount,
        grossMarginPct: newGrossMarginPct,
        status: proposal.status,
      };

      await this.pricingRulesRepository.createDiscount(
        {
          approverLevel: dto.approverLevel,
          discountApplied: accumulatedDiscount,
          proposalId: id,
          originTotalRevenue,
        },
        tx,
      );
      return await this.proposalsRepository.update(body, id, tx);
    });
  }
}
