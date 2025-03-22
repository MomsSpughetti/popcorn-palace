import { BadRequestException, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class BookingsService {
  constructor(private readonly databaseService: DatabaseService) {}

  async create(createBookingDto: Prisma.BookingCreateInput) {

    // check if seatNumber is empty
    if (!createBookingDto.seatNumber || createBookingDto.seatNumber < 1) {
      throw new BadRequestException('Seat number must be a positive integer.');
    }

    // check userid
    if (!createBookingDto.userId || createBookingDto.userId.trim() === '') {
      throw new BadRequestException('User ID must not be empty.');
    }
    
    const booking = await this.databaseService.booking.create({
      data: createBookingDto,
    });
    
    return {
      "bookingId": booking.id,
    }


  }

  async findAll() {
    return await this.databaseService.booking.findMany();
  }

  async delete(id: string) {  
    return await this.databaseService.booking.delete({
      where: { id },
    });
  }

}
