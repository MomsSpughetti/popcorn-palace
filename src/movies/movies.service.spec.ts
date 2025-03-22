import { Test, TestingModule } from '@nestjs/testing';
import { MoviesService } from './movies.service';
import { DatabaseService } from '../database/database.service';
import { Prisma } from '@prisma/client';
import { NotFoundException } from '@nestjs/common';

describe('MoviesService', () => {
  let service: MoviesService;
  let databaseService: any;

  beforeEach(async () => {
    const mockDatabaseService = {
      movie: {
        create: jest.fn(),
        findMany: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MoviesService,
        {
          provide: DatabaseService,
          useValue: mockDatabaseService,
        },
      ],
    }).compile();

    service = module.get<MoviesService>(MoviesService);
    databaseService = module.get<DatabaseService>(DatabaseService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a movie', async () => {
    const createMovieDto = {
      id: 1,
      title: 'Test Movie',
      genre: 'Action',
      duration: 120,
      rating: 8.5,
      releaseYear: 2023,
    };
    databaseService.movie.create.mockResolvedValue(createMovieDto);

    await service.create(createMovieDto);

    expect(databaseService.movie.create).toHaveBeenCalledWith({ data: createMovieDto });
  });

  it('should find all movies', async () => {
    const movies = [
      { id: 1, title: 'Test Movie 1' },
      { id: 2, title: 'Test Movie 2' },
    ];
    databaseService.movie.findMany.mockResolvedValue(movies);

    const result = await service.findAll();

    expect(result).toEqual(movies);
    expect(databaseService.movie.findMany).toHaveBeenCalled();
  });

  it('should find one movie by id', async () => {
    const movie = { id: 1, title: 'Test Movie' };
    databaseService.movie.findUnique.mockResolvedValue(movie);

    const result = await service.findOne(1);

    expect(result).toEqual(movie);
    expect(databaseService.movie.findUnique).toHaveBeenCalledWith({ where: { id: 1 } });
  });

  it('should update a movie by title', async () => {
    const title = 'Test Movie';
    const updateMovieDto = { title: 'Updated Title' };
    databaseService.movie.findUnique.mockResolvedValue({ title });
    databaseService.movie.update.mockResolvedValue({ title, ...updateMovieDto });

    await service.updateByTitle(title, updateMovieDto);

    expect(databaseService.movie.update).toHaveBeenCalledWith({ where: { title }, data: updateMovieDto });
  });

  it('should remove a movie by title', async () => {
    const title = 'Test Movie';
    databaseService.movie.delete.mockResolvedValue({ count: 1 });

    await service.removeByTitle(title);

    expect(databaseService.movie.delete).toHaveBeenCalledWith({ where: { title } });
  });

  it('should throw NotFoundException if movie to update by title does not exist', async () => {
    const title = 'Nonexistent Movie';
    const updateMovieDto = { title: 'Updated Title' };
    databaseService.movie.findUnique.mockResolvedValue(null);

    await expect(service.updateByTitle(title, updateMovieDto)).rejects.toThrow(NotFoundException);
    expect(databaseService.movie.update).not.toHaveBeenCalled();
  });
});