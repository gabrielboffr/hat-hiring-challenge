import { PricingRulesController } from './pricing-rules.controller';
import { PricingRulesService } from './pricing-rules.service';

describe('PricingRulesController', () => {
  const pricingRulesService = {
    getPricingTable: jest.fn(),
    getDiscountTable: jest.fn(),
  } as unknown as jest.Mocked<PricingRulesService>;

  let controller: PricingRulesController;

  beforeEach(() => {
    jest.clearAllMocks();
    controller = new PricingRulesController(pricingRulesService);
  });

  it('delegates getPricingTable to service', async () => {
    pricingRulesService.getPricingTable.mockResolvedValue([
      { id: 'pt1' },
    ] as never);

    await expect(controller.getPricingTable()).resolves.toEqual([
      { id: 'pt1' },
    ]);
    expect(pricingRulesService.getPricingTable).toHaveBeenCalledTimes(1);
  });

  it('delegates getDiscountTable to service', async () => {
    pricingRulesService.getDiscountTable.mockResolvedValue([
      { id: 'dt1' },
    ] as never);

    await expect(controller.getDiscountTable()).resolves.toEqual([
      { id: 'dt1' },
    ]);
    expect(pricingRulesService.getDiscountTable).toHaveBeenCalledTimes(1);
  });
});
