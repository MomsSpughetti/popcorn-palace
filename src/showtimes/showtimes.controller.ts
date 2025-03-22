import { Controller, Get, Post, Body, Patch, Param, Delete, UseFilters } from '@nestjs/common';
import { ShowtimesService } from './showtimes.service';
import { Prisma } from '@prisma/client';
import { ShowtimesExceptionFilter } from '../exception-filters/showtimes-filter/showtimes-filter.filter';

@Controller('showtimes')
@UseFilters(ShowtimesExceptionFilter)
export class ShowtimesController {
  constructor(private readonly showtimesService: ShowtimesService) {}

  @Post()
  async create(@Body() createShowtimeDto: Prisma.ShowtimeCreateInput) {
    return await this.showtimesService.create(createShowtimeDto);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.showtimesService.findOne(+id);
  }

  @Post('update/:id')
  async update(@Param('id') id: string, @Body() updateShowtimeDto: Prisma.ShowtimeUpdateInput) {
    await this.showtimesService.update(+id, updateShowtimeDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.showtimesService.remove(+id);
  }
}
