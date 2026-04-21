import { BadRequestException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PricingRulesRepository } from 'src/pricing-rules/pricing-rules.repository';
import { ProfessionalsRepository } from 'src/professionals/professionals.repository';
import { PrismaService } from 'src/database/prisma.service';
import { ProposalsRepository } from './proposals.repository';
import { ProposalsService } from './proposals.service';

describe('ProposalsService', () => {
  let service: ProposalsService;

  const proposalsRepository = {
    create: jest.fn(),
    findById: jest.fn(),
    getProposals: jest.fn(),
    update: jest.fn(),
  } as unknown as jest.Mocked<ProposalsRepository>;

  const professionalsRepository = {
    findByName: jest.fn(),
    findById: jest.fn(),
  } as unknown as jest.Mocked<ProfessionalsRepository>;

  const pricingRulesRepository = {
    findExistingDiscount: jest.fn(),
    getMaxAllowedDiscount: jest.fn(),
    findFirstProposal: jest.fn(),
    createDiscount: jest.fn(),
  } as unknown as jest.Mocked<PricingRulesRepository>;

  const prisma = {
    $transaction: jest.fn(),
  } as unknown as jest.Mocked<PrismaService>;

  beforeEach(() => {
    jest.clearAllMocks();

    service = new ProposalsService(
      proposalsRepository,
      professionalsRepository,
      pricingRulesRepository,
      prisma,
    );
  });

  it('should keep proposal as PENDING when gross margin is exactly 40%', async () => {
    const professional = {
      id: 'prof-1',
      name: 'Maria',
      seniority: 'SENIOR',
      costPerHour: new Prisma.Decimal(60),
      billRatePerHour: new Prisma.Decimal(100),
    };

    professionalsRepository.findByName.mockResolvedValue(professional as never);
    proposalsRepository.create.mockResolvedValue({ id: 'proposal-1' } as never);

    const createMany = jest.fn().mockResolvedValue(undefined);
    prisma.$transaction.mockImplementation(async (callback: any) =>
      callback({ proposalProfessional: { createMany } }),
    );

    const result = await service.create({
      client: 'Empresa XYZ',
      description: 'Projeto teste',
      startDate: '2026-01-10' as unknown as Date,
      endDate: '2026-02-10' as unknown as Date,
      professionals: [{ name: 'Maria', estimatedHours: 1 }],
    } as any);

    const createPayload = proposalsRepository.create.mock.calls[0][0];

    expect(Number(createPayload.grossMarginPct.toString())).toBe(40);
    expect(createPayload.status).toBe('PENDING');
    expect(result.status).toBe('PENDING');
  });

  it('should throw when a professional has zero allocated hours', async () => {
    professionalsRepository.findByName.mockResolvedValue({
      id: 'prof-2',
      name: 'Joao',
      seniority: 'JUNIOR',
      costPerHour: new Prisma.Decimal(45),
      billRatePerHour: new Prisma.Decimal(95),
    } as never);

    await expect(
      service.create({
        client: 'Empresa XYZ',
        description: 'Projeto sem horas',
        startDate: '2026-01-10' as unknown as Date,
        endDate: '2026-02-10' as unknown as Date,
        professionals: [{ name: 'Joao', estimatedHours: 0 }],
      } as any),
    ).rejects.toBeInstanceOf(BadRequestException);

    expect(proposalsRepository.create).not.toHaveBeenCalled();
  });

  it('should block discount when accumulated percentage exceeds approver limit', async () => {
    prisma.$transaction.mockImplementation(async (callback: any) =>
      callback({}),
    );

    proposalsRepository.findById.mockResolvedValue({
      id: 'proposal-2',
      totalRevenue: new Prisma.Decimal(1000),
      totalCost: new Prisma.Decimal(500),
      status: 'PENDING',
    } as never);

    pricingRulesRepository.findExistingDiscount.mockResolvedValue(5 as never);
    pricingRulesRepository.getMaxAllowedDiscount.mockResolvedValue(15 as never);

    await expect(
      service.applyDiscount(
        {
          approverLevel: 'COMMERCIAL_MANAGER' as any,
          applyDiscount: new Prisma.Decimal(12) as any,
        },
        'proposal-2',
      ),
    ).rejects.toBeInstanceOf(BadRequestException);

    expect(pricingRulesRepository.createDiscount).not.toHaveBeenCalled();
    expect(proposalsRepository.update).not.toHaveBeenCalled();
  });
});
