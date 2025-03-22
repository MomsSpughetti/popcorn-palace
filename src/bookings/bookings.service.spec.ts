import { Test, TestingModule } from '@nestjs/testing';
import { BookingsService } from './bookings.service';
import { DatabaseService } from '../database/database.service';
import { Prisma } from '@prisma/client';

describe('BookingsService', () => {
  let service: BookingsService;
  let databaseService: any;

  beforeEach(async () => {
    const mockDatabaseService = {
      booking: {
        create: jest.fn(),
        findMany: jest.fn(),
        delete: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BookingsService,
        {
          provide: DatabaseService,
          useValue: mockDatabaseService,
        },
      ],
    }).compile();

    service = module.get<BookingsService>(BookingsService);
    databaseService = module.get<DatabaseService>(DatabaseService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a booking', async () => {
    const createBookingDto: Prisma.BookingCreateInput = {
      seatNumber: 1,
      userId: 'user123',
      showtime: { connect: { id: 1 } },
    };

    const createdBooking = { id: 'booking1', ...createBookingDto };
    databaseService.booking.create.mockResolvedValue(createdBooking);

    const result = await service.create(createBookingDto);

    expect(databaseService.booking.create).toHaveBeenCalledWith({ data: createBookingDto });
    expect(result).toEqual({ bookingId: createdBooking.id });
  });

  it('should find all bookings', async () => {
    const bookings = [
      { id: 'booking1', seatNumber: 1, userId: 'user123', showtimeId: 1 },
      { id: 'booking2', seatNumber: 2, userId: 'user456', showtimeId: 2 },
    ];
    databaseService.booking.findMany.mockResolvedValue(bookings);

    const result = await service.findAll();

    expect(result).toEqual(bookings);
    expect(databaseService.booking.findMany).toHaveBeenCalled();
  });

  it('should delete a booking by id', async () => {
    const id = 'booking1';
    databaseService.booking.delete.mockResolvedValue({ id });

    await service.delete(id);

    expect(databaseService.booking.delete).toHaveBeenCalledWith({ where: { id } });
  });
});