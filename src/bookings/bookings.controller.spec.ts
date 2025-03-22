import { Test, TestingModule } from '@nestjs/testing';
import { BookingsController } from './bookings.controller';
import { BookingsService } from './bookings.service';
import { Prisma } from '@prisma/client'; // Import Prisma types

describe('BookingsController', () => {
  let controller: BookingsController;
  let bookingsService: any;

  beforeEach(async () => {
    const mockBookingsService = {
      create: jest.fn(),
      findAll: jest.fn(),
      delete: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [BookingsController],
      providers: [
        {
          provide: BookingsService,
          useValue: mockBookingsService,
        },
      ],
    }).compile();

    controller = module.get<BookingsController>(BookingsController);
    bookingsService = module.get<BookingsService>(BookingsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call bookingsService.create with correct data', async () => {
    const createBookingDto: Prisma.BookingCreateInput = {
      showtime: {
        connect: {
          id: 1,
        },
      },
      userId: "1",
      seatNumber: 2,
    };

    await controller.create(createBookingDto);
    expect(bookingsService.create).toHaveBeenCalledWith(createBookingDto);
  });

  it('should call bookingsService.findAll when findAll is called', async () => {
    await controller.findAll();
    expect(bookingsService.findAll).toHaveBeenCalled();
  });

  it('should call bookingsService.delete with correct id', async () => {
    const id = '1';
    await controller.delete(id);
    expect(bookingsService.delete).toHaveBeenCalledWith(id);
  });

});