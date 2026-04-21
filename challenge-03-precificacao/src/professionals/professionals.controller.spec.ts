import { ProfessionalsController } from './professionals.controller';
import { ProfessionalsService } from './professionals.service';

describe('ProfessionalsController', () => {
  const professionalsService = {
    create: jest.fn(),
    findAll: jest.fn(),
  } as unknown as jest.Mocked<ProfessionalsService>;

  let controller: ProfessionalsController;

  beforeEach(() => {
    jest.clearAllMocks();
    controller = new ProfessionalsController(professionalsService);
  });

  it('delegates create to service', async () => {
    const dto = { name: 'Ana', seniority: 'SENIOR' } as any;
    professionalsService.create.mockResolvedValue({ id: 'p1' } as never);

    await expect(controller.create(dto)).resolves.toEqual({ id: 'p1' });
    expect(professionalsService.create).toHaveBeenCalledWith(dto);
  });

  it('delegates findAll to service', async () => {
    professionalsService.findAll.mockResolvedValue([{ id: 'p1' }] as never);

    await expect(controller.findAll()).resolves.toEqual([{ id: 'p1' }]);
    expect(professionalsService.findAll).toHaveBeenCalledTimes(1);
  });
});
