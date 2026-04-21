import { ProfessionalsRepository } from './professionals.repository';

describe('ProfessionalsRepository', () => {
  const prisma = {
    professionals: {
      create: jest.fn(),
      findMany: jest.fn(),
      findFirst: jest.fn(),
    },
    pricingTable: {
      findFirst: jest.fn(),
    },
  } as any;

  let repository: ProfessionalsRepository;

  beforeEach(() => {
    jest.clearAllMocks();
    repository = new ProfessionalsRepository(prisma);
  });

  it('creates a professional', async () => {
    prisma.professionals.create.mockResolvedValue({ id: '1' });
    await expect(repository.create({ name: 'A' } as any)).resolves.toEqual({
      id: '1',
    });
    expect(prisma.professionals.create).toHaveBeenCalledWith({
      data: { name: 'A' },
    });
  });

  it('gets pricing by seniority', async () => {
    prisma.pricingTable.findFirst.mockResolvedValue({ seniority: 'SENIOR' });
    await expect(
      repository.getPricingBySeniority('SENIOR' as any),
    ).resolves.toEqual({
      seniority: 'SENIOR',
    });
    expect(prisma.pricingTable.findFirst).toHaveBeenCalledWith({
      where: { seniority: 'SENIOR' },
    });
  });

  it('finds all professionals', async () => {
    prisma.professionals.findMany.mockResolvedValue([{ id: '1' }]);
    await expect(repository.findAll()).resolves.toEqual([{ id: '1' }]);
    expect(prisma.professionals.findMany).toHaveBeenCalledTimes(1);
  });

  it('finds professionals by name and by id', async () => {
    prisma.professionals.findFirst.mockResolvedValue({ id: '1' });

    await repository.findByName('Ana');
    expect(prisma.professionals.findFirst).toHaveBeenCalledWith({
      where: { name: 'Ana' },
    });

    await repository.findById('1');
    expect(prisma.professionals.findFirst).toHaveBeenCalledWith({
      where: { id: '1' },
    });
  });
});
