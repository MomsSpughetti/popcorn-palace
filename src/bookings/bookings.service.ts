import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class BookingsService {
  constructor(private readonly databaseService: DatabaseService) {}

  async create(createBookingDto: Prisma.BookingCreateInput) {

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
