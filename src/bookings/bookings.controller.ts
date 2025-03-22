import { Controller, Get, Post, Body, Patch, Param, Delete, UseFilters } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { Prisma } from '@prisma/client';
import { BookingsExceptionFilter } from 'src/exception-filters/bookings-filter/bookings-filter.filter';

@Controller('bookings')
@UseFilters(BookingsExceptionFilter)
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Post()
  async create(@Body() createBookingDto: Prisma.BookingCreateInput) {
      return await this.bookingsService.create(createBookingDto);
  }

  @Get('all')
  async findAll() {
    return await this.bookingsService.findAll();
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return await this.bookingsService.delete(id);
  }

}
