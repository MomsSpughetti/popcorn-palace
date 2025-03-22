import { Controller, Get, Post, Body, Patch, Param, Delete, UseFilters } from '@nestjs/common';
import { MoviesService } from './movies.service';
import { Prisma } from '@prisma/client';
import { MoviesExceptionFilter } from 'src/exception-filters/movies-filter/movies-filter.filter';

@Controller('movies')
@UseFilters(MoviesExceptionFilter)
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  @Post()
  async create(@Body() createMovieDto: Prisma.MovieCreateInput) {
    return await this.moviesService.create(createMovieDto);
  }

  @Get('all')
  async findAll() {
    return await this.moviesService.findAll();
  }

  @Post('update/:title')
  async update(@Param('title') title: string, @Body() updateMovieDto: Prisma.MovieUpdateInput) {
      return await this.moviesService.updateByTitle(title, updateMovieDto);
  }

  @Delete(':title')
  async remove(@Param('title') title: string) {
      await this.moviesService.removeByTitle(title);
  }

}
