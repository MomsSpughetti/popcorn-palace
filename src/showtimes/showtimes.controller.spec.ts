import { Test, TestingModule } from '@nestjs/testing';
import { ShowtimesController } from './showtimes.controller';
import { ShowtimesService } from './showtimes.service';
import { Prisma } from '@prisma/client'; // Import Prisma types

describe('ShowtimesController', () => {
  let controller: ShowtimesController;
  let showtimesService: any;

  beforeEach(async () => {
    const mockShowtimesService = {
      create: jest.fn(),
      findAll: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ShowtimesController],
      providers: [
        {
          provide: ShowtimesService,
          useValue: mockShowtimesService,
        },
      ],
    }).compile();

    controller = module.get<ShowtimesController>(ShowtimesController);
    showtimesService = module.get<ShowtimesService>(ShowtimesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call showtimesService.create with correct data', async () => {
    const createShowtimeDto: Prisma.ShowtimeCreateInput = {
      theater: 'Theater A',
      startTime: new Date('2023-10-27T10:00:00Z'),
      endTime: new Date('2023-10-27T12:00:00Z'),
      price: 15.00,
      movie: {
        connect: {
          id: 1,
        },
      },
    };

    await controller.create(createShowtimeDto);
    expect(showtimesService.create).toHaveBeenCalledWith(createShowtimeDto);
  });


  it('should call showtimesService.update with correct data', async () => {
    const id = 1;
    const updateShowtimeDto: Prisma.ShowtimeUpdateInput = {
      movie: {
        connect: {
          id: 1,
        },
      },
      theater: 'Theater B',
      startTime: new Date('2023-10-28T14:00:00Z'),
      endTime: new Date('2023-10-28T16:00:00Z'),
      price: 20.00,
    };
    await controller.update(String(id), updateShowtimeDto);
    expect(showtimesService.update).toHaveBeenCalledWith(id, updateShowtimeDto);
  });

  it('should call showtimesService.remove with correct id', async () => {
    const id = 1;
    await controller.remove(String(id));
    expect(showtimesService.remove).toHaveBeenCalledWith(id);
  });

});