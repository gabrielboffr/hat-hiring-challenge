import { NotFoundException } from '@nestjs/common';
import { ProfessionalsRepository } from './professionals.repository';
import { ProfessionalsService } from './professionals.service';

describe('ProfessionalsService', () => {
  const professionalsRepository = {
    getPricingBySeniority: jest.fn(),
    create: jest.fn(),
    findAll: jest.fn(),
  } as unknown as jest.Mocked<ProfessionalsRepository>;

  let service: ProfessionalsService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new ProfessionalsService(professionalsRepository);
  });

  it('creates professional using pricing table values', async () => {
    professionalsRepository.getPricingBySeniority.mockResolvedValue({
      costPerHour: 100,
      billRatePerHour: 200,
    } as never);
    professionalsRepository.create.mockResolvedValue({ id: 'prof-1' } as never);

    const dto = { name: 'Bruno', seniority: 'SENIOR' } as any;
    await expect(service.create(dto)).resolves.toEqual({ id: 'prof-1' });

    expect(professionalsRepository.create).toHaveBeenCalledWith({
      ...dto,
      costPerHour: 100,
      billRatePerHour: 200,
    });
  });

  it('throws when pricing table is not found', async () => {
    professionalsRepository.getPricingBySeniority.mockResolvedValue(
      null as never,
    );

    await expect(
      service.create({ name: 'Bruno', seniority: 'SENIOR' } as any),
    ).rejects.toBeInstanceOf(NotFoundException);
  });

  it('delegates findAll', async () => {
    professionalsRepository.findAll.mockResolvedValue([
      { id: 'prof-1' },
    ] as never);

    await expect(service.findAll()).resolves.toEqual([{ id: 'prof-1' }]);
    expect(professionalsRepository.findAll).toHaveBeenCalledTimes(1);
  });
});
