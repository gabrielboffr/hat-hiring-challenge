import { PricingRulesRepository } from './pricing-rules.repository';
import { PricingRulesService } from './pricing-rules.service';

describe('PricingRulesService', () => {
  const pricingRulesRepository = {
    getPricingTable: jest.fn(),
    getDiscountTable: jest.fn(),
    getMaxAllowedDiscount: jest.fn(),
  } as unknown as jest.Mocked<PricingRulesRepository>;

  let service: PricingRulesService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new PricingRulesService(pricingRulesRepository);
  });

  it('delegates getPricingTable', async () => {
    pricingRulesRepository.getPricingTable.mockResolvedValue([
      { id: 'pt1' },
    ] as never);

    await expect(service.getPricingTable()).resolves.toEqual([{ id: 'pt1' }]);
    expect(pricingRulesRepository.getPricingTable).toHaveBeenCalledTimes(1);
  });

  it('delegates getDiscountTable', async () => {
    pricingRulesRepository.getDiscountTable.mockResolvedValue([
      { id: 'dt1' },
    ] as never);

    await expect(service.getDiscountTable()).resolves.toEqual([{ id: 'dt1' }]);
    expect(pricingRulesRepository.getDiscountTable).toHaveBeenCalledTimes(1);
  });

  it('delegates getMaxAllowedDiscount', async () => {
    pricingRulesRepository.getMaxAllowedDiscount.mockResolvedValue(15 as never);

    await expect(
      service.getMaxAllowedDiscount('COMMERCIAL_MANAGER' as any),
    ).resolves.toBe(15);
    expect(pricingRulesRepository.getMaxAllowedDiscount).toHaveBeenCalledWith(
      'COMMERCIAL_MANAGER',
    );
  });
});
