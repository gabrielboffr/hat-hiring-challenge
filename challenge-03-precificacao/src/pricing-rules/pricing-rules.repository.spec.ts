import { PricingRulesRepository } from './pricing-rules.repository';

describe('PricingRulesRepository', () => {
  const prisma = {
    pricingTable: {
      findMany: jest.fn(),
    },
    discountTable: {
      findMany: jest.fn(),
      findFirst: jest.fn(),
    },
    discountProposalApplied: {
      create: jest.fn(),
      findFirst: jest.fn(),
    },
  } as any;

  let repository: PricingRulesRepository;

  beforeEach(() => {
    jest.clearAllMocks();
    repository = new PricingRulesRepository(prisma);
  });

  it('returns pricing table and discount table', async () => {
    prisma.pricingTable.findMany.mockResolvedValue([{ id: 'pt1' }]);
    prisma.discountTable.findMany.mockResolvedValue([{ id: 'dt1' }]);

    await expect(repository.getPricingTable()).resolves.toEqual([
      { id: 'pt1' },
    ]);
    await expect(repository.getDiscountTable()).resolves.toEqual([
      { id: 'dt1' },
    ]);
  });

  it('returns max allowed discount and defaults to zero', async () => {
    prisma.discountTable.findFirst.mockResolvedValueOnce({
      maxAllowedDiscount: 15,
    });
    prisma.discountTable.findFirst.mockResolvedValueOnce(null);

    await expect(
      repository.getMaxAllowedDiscount('COMMERCIAL_MANAGER' as any),
    ).resolves.toBe(15);
    await expect(
      repository.getMaxAllowedDiscount('COMMERCIAL_MANAGER' as any),
    ).resolves.toBe(0);
  });

  it('creates discount using tx client', async () => {
    const tx = {
      discountProposalApplied: {
        create: jest.fn().mockResolvedValue({ id: 'd1' }),
      },
    } as any;

    await expect(
      repository.createDiscount(
        {
          approverLevel: 'CEO' as any,
          discountApplied: 5 as any,
          proposalId: 'p1',
          originTotalRevenue: 100 as any,
        },
        tx,
      ),
    ).resolves.toEqual({ id: 'd1' });

    expect(tx.discountProposalApplied.create).toHaveBeenCalled();
  });

  it('returns latest and first discount values with zero fallback', async () => {
    prisma.discountProposalApplied.findFirst
      .mockResolvedValueOnce({ discountApplied: 8 })
      .mockResolvedValueOnce({ originTotalRevenue: 1000 })
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce(null);

    await expect(repository.findExistingDiscount('p1')).resolves.toBe(8);
    await expect(repository.findFirstProposal('p1')).resolves.toBe(1000);
    await expect(repository.findExistingDiscount('p1')).resolves.toBe(0);
    await expect(repository.findFirstProposal('p1')).resolves.toBe(0);
  });
});
