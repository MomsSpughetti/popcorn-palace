import { Injectable, BadRequestException, NotFoundException, ConflictException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class ShowtimesService {
  constructor(private readonly databaseService: DatabaseService) {}

  async create(createShowtimeDto: Prisma.ShowtimeCreateInput) {

    const { theater, startTime, endTime } = createShowtimeDto;
    // check if theater is empty
    if (!theater || theater.trim() === '') {
      throw new BadRequestException('Theater value cannot be empty.');
    }
    

    const overlappingShowtime = await this.databaseService.showtime.findFirst({
      where: {
        theater,
        OR: [
          {
            startTime: { lte: endTime, gte: startTime }
          },
          {
            endTime: { lte: endTime, gte: startTime }
          },
        ],
      },
    });

    if (overlappingShowtime) {
      throw new ConflictException('There is already a showtime in this theater at this time.');
    }

    return await this.databaseService.showtime.create({
      data: createShowtimeDto,
    });
  }

  async findOne(id: number) {
    const showtime =  await this.databaseService.showtime.findUnique({
      where: { id },
    });
    
    if (!showtime) {
      throw new NotFoundException(`Showtime with id ${id} not found.`);
    }
  }

  async update(id: number, updateShowtimeDto: Prisma.ShowtimeUpdateInput) {
    const { theater, startTime, endTime } = updateShowtimeDto;

    const currentShowtime = await this.databaseService.showtime.findUnique({
      where: { id },
    });
  
    if (!currentShowtime) {
      throw new NotFoundException(`Showtime with id ${id} not found.`);
    }
  
    const checkStartTime = startTime ? (startTime as Date) : currentShowtime.startTime;
    const checkEndTime = endTime ? (endTime as Date) : currentShowtime.endTime;
    const checkTheater = theater ? (theater as string) : currentShowtime.theater;
  
    const overlappingShowtime = await this.databaseService.showtime.findFirst({
      where: {
        theater: checkTheater,
        id: { not: id }, // Exclude the showtime being updated
        OR: [
          {
            startTime: { lte: checkEndTime, gte: checkStartTime },
          },
          {
            endTime: { lte: checkEndTime, gte: checkStartTime },
          },
        ],
      },
    });
  
    if (overlappingShowtime) {
      throw new ConflictException('There is already a showtime in this theater at this time.');
    }
  
    await this.databaseService.showtime.update({
      where: { id },
      data: updateShowtimeDto,
    });
  }

  async remove(id: number) {
    return await this.databaseService.showtime.delete({
      where: { id },
    });
  }
}
