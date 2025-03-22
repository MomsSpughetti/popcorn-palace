import { Test, TestingModule } from '@nestjs/testing';
import { ShowtimesService } from './showtimes.service';
import { DatabaseService } from '../database/database.service';
import { Prisma } from '@prisma/client';
import { BadRequestException } from '@nestjs/common';

describe('ShowtimesService', () => {
  let service: ShowtimesService;
  let databaseService: any;

  beforeEach(async () => {
    const mockDatabaseService = {
      showtime: {
        create: jest.fn(),
        findUnique: jest.fn(),
        findFirst: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ShowtimesService,
        {
          provide: DatabaseService,
          useValue: mockDatabaseService,
        },
      ],
    }).compile();

    service = module.get<ShowtimesService>(ShowtimesService);
    databaseService = module.get<DatabaseService>(DatabaseService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a showtime if no overlap', async () => {
    const createShowtimeDto: Prisma.ShowtimeCreateInput = {
      movie: { connect: { id: 1 } },
      theater: 'Theater A',
      startTime: new Date('2023-10-27T10:00:00Z'),
      endTime: new Date('2023-10-27T12:00:00Z'),
      price: 15.00,
    };

    databaseService.showtime.findFirst.mockResolvedValue(null); // No overlap

    await service.create(createShowtimeDto);

    expect(databaseService.showtime.create).toHaveBeenCalledWith({ data: createShowtimeDto });
  });

  it('should throw BadRequestException if overlap exists', async () => {
    const createShowtimeDto: Prisma.ShowtimeCreateInput = {
      movie: { connect: { id: 1 } },
      theater: 'Theater A',
      startTime: new Date('2023-10-27T10:00:00Z'),
      endTime: new Date('2023-10-27T12:00:00Z'),
      price: 15.00,
    };

    databaseService.showtime.findFirst.mockResolvedValue({ id: 1 }); // Simulate overlap

    await expect(service.create(createShowtimeDto)).rejects.toThrow(BadRequestException);
    expect(databaseService.showtime.create).not.toHaveBeenCalled();
  });

  it('should find a showtime by id', async () => {
    const showtime = { id: 1, movie: { id: 1 }, theater: 'Theater A' };
    databaseService.showtime.findUnique.mockResolvedValue(showtime);

    const result = await service.findOne(1);
    expect(result).toEqual(showtime);
    expect(databaseService.showtime.findUnique).toHaveBeenCalledWith({ where: { id: 1 } });
  });

  it('should update a showtime if no overlap', async () => {
    const id = 1;
    const updateShowtimeDto: Prisma.ShowtimeUpdateInput = {
      movie: { connect: { id: 2 } },
      theater: 'Theater B',
      startTime: new Date('2023-10-28T14:00:00Z'),
      endTime: new Date('2023-10-28T16:00:00Z'),
      price: 20.00,
    };

    databaseService.showtime.findUnique.mockResolvedValue({ id, movie: { id: 1 }, theater: 'Theater A', startTime: new Date(), endTime: new Date() });
    databaseService.showtime.findFirst.mockResolvedValue(null); // No overlap

    await service.update(id, updateShowtimeDto);

    expect(databaseService.showtime.update).toHaveBeenCalledWith({ where: { id }, data: updateShowtimeDto });
  });

  it('should throw BadRequestException if update overlap exists', async () => {
    const id = 1;
    const updateShowtimeDto: Prisma.ShowtimeUpdateInput = {
      movie: { connect: { id: 2 } },
      theater: 'Theater B',
      startTime: new Date('2023-10-28T14:00:00Z'),
      endTime: new Date('2023-10-28T16:00:00Z'),
      price: 20.00,
    };

    databaseService.showtime.findUnique.mockResolvedValue({ id, movie: { id: 1 }, theater: 'Theater A', startTime: new Date(), endTime: new Date() });
    databaseService.showtime.findFirst.mockResolvedValue({ id: 2 }); // Simulate overlap

    await expect(service.update(id, updateShowtimeDto)).rejects.toThrow(BadRequestException);
    expect(databaseService.showtime.update).not.toHaveBeenCalled();
  });

  it('should remove a showtime by id', async () => {
    const id = 1;
    await service.remove(id);
    expect(databaseService.showtime.delete).toHaveBeenCalledWith({ where: { id } });
  });

  it('should throw BadRequestException if showtime to update does not exist', async () => {
    const id = 1;
    const updateShowtimeDto: Prisma.ShowtimeUpdateInput = {
      movie: { connect: { id: 2 } },
      theater: 'Theater B',
      startTime: new Date('2023-10-28T14:00:00Z'),
      endTime: new Date('2023-10-28T16:00:00Z'),
      price: 20.00,
    };

    databaseService.showtime.findUnique.mockResolvedValue(null);

    await expect(service.update(id, updateShowtimeDto)).rejects.toThrow(BadRequestException);
    expect(databaseService.showtime.update).not.toHaveBeenCalled();

  });
});