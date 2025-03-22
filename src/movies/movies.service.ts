import { Injectable, NotFoundException, InternalServerErrorException, ConflictException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class MoviesService {
  constructor(private readonly databaseService: DatabaseService) {}

  async create(createMovieDto: Prisma.MovieCreateInput) {
    return await this.databaseService.movie.create({
      data: createMovieDto,
    });
  }

  async findAll() {
    return this.databaseService.movie.findMany();
  }

  async findOne(id: number) {
    return this.databaseService.movie.findUnique({
      where: { id },
    });
  }

  async updateByTitle(title: string, updateMovieDto: Prisma.MovieUpdateInput): Promise<void> {
    const movie = await this.databaseService.movie.findUnique({
      where: { title },
    });

    if (!movie) {
      throw new NotFoundException(`Movie with title '${title}' not found.`);
    }
      await this.databaseService.movie.update({
        where: { title },
        data: updateMovieDto,
      });
  }


  async removeByTitle(title: string): Promise<void> {
    await this.databaseService.movie.delete({
      where: { title },
    });
  }
}
