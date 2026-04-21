import { ProposalsController } from './proposals.controller';
import { ProposalsService } from './proposals.service';

describe('ProposalsController', () => {
  const proposalsService = {
    create: jest.fn(),
    getProposals: jest.fn(),
    findById: jest.fn(),
    applyDiscount: jest.fn(),
  } as unknown as jest.Mocked<ProposalsService>;

  let controller: ProposalsController;

  beforeEach(() => {
    jest.clearAllMocks();
    controller = new ProposalsController(proposalsService);
  });

  it('delegates create to service', async () => {
    const dto = { client: 'ACME' } as any;
    proposalsService.create.mockResolvedValue({ id: '1' } as never);

    await expect(controller.create(dto)).resolves.toEqual({ id: '1' });
    expect(proposalsService.create).toHaveBeenCalledWith(dto);
  });

  it('delegates getProposals to service', async () => {
    const params = { client: 'ACME', status: 'PENDING' } as any;
    proposalsService.getProposals.mockResolvedValue([] as never);

    await expect(controller.getProposals(params)).resolves.toEqual([]);
    expect(proposalsService.getProposals).toHaveBeenCalledWith(params);
  });

  it('delegates findById to service', async () => {
    proposalsService.findById.mockResolvedValue({ id: 'proposal-1' } as never);

    await expect(controller.findById('proposal-1')).resolves.toEqual({
      id: 'proposal-1',
    });
    expect(proposalsService.findById).toHaveBeenCalledWith('proposal-1');
  });

  it('delegates applyDiscount to service', async () => {
    const dto = { approverLevel: 'CEO', applyDiscount: 1 } as any;
    proposalsService.applyDiscount.mockResolvedValue({
      id: 'proposal-1',
    } as never);

    await expect(controller.applyDiscount(dto, 'proposal-1')).resolves.toEqual({
      id: 'proposal-1',
    });
    expect(proposalsService.applyDiscount).toHaveBeenCalledWith(
      dto,
      'proposal-1',
    );
  });
});
