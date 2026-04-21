import { ProposalsRepository } from './proposals.repository';

describe('ProposalsRepository', () => {
  const prisma = {
    proposals: {
      create: jest.fn(),
      findFirst: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
    },
  } as any;

  let repository: ProposalsRepository;

  beforeEach(() => {
    jest.clearAllMocks();
    repository = new ProposalsRepository(prisma);
  });

  it('uses tx client when creating', async () => {
    const tx = {
      proposals: { create: jest.fn().mockResolvedValue({ id: '1' }) },
    } as any;
    await repository.create({ client: 'ACME' }, tx);
    expect(tx.proposals.create).toHaveBeenCalledWith({
      data: { client: 'ACME' },
    });
  });

  it('finds proposal by id', async () => {
    prisma.proposals.findFirst.mockResolvedValue({ id: '1' });
    await expect(repository.findById('1')).resolves.toEqual({ id: '1' });
    expect(prisma.proposals.findFirst).toHaveBeenCalledWith({
      where: { id: '1' },
    });
  });

  it('builds where clause for all filters', async () => {
    prisma.proposals.findMany.mockResolvedValue([]);
    await repository.getProposals({
      client: 'ACME',
      status: 'PENDING',
      startDate: '2026-01-01' as any,
      endDate: '2026-01-31' as any,
    });

    const callArg = prisma.proposals.findMany.mock.calls[0][0];
    expect(callArg.where.client).toBe('ACME');
    expect(callArg.where.status).toBe('PENDING');
    expect(callArg.where.startDate.gte).toBeInstanceOf(Date);
    expect(callArg.where.endDate.lte).toBeInstanceOf(Date);
  });

  it('updates proposal using default prisma client', async () => {
    prisma.proposals.update.mockResolvedValue({ id: '1' });
    await expect(
      repository.update({ status: 'APPROVED' }, '1'),
    ).resolves.toEqual({
      id: '1',
    });
    expect(prisma.proposals.update).toHaveBeenCalledWith({
      where: { id: '1' },
      data: { status: 'APPROVED' },
    });
  });
});
