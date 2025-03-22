import { Test, TestingModule } from '@nestjs/testing';
import { MoviesController } from './movies.controller';
import { MoviesService } from './movies.service';

describe('MoviesController', () => {
  let controller: MoviesController;
  let moviesService: any;

  beforeEach(async () => {
    const mockMoviesService = {
      create: jest.fn(),
      findAll: jest.fn(),
      updateByTitle: jest.fn(),
      removeByTitle: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [MoviesController],
      providers: [
        {
          provide: MoviesService,
          useValue: mockMoviesService,
        },
      ],
    }).compile();

    controller = module.get<MoviesController>(MoviesController);
    moviesService = module.get<MoviesService>(MoviesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call moviesService.create with correct data', async () => {
    const createMovieDto = {
      id: 1,
      title: 'Test Movie',
      genre: 'Action',
      duration: 120,
      rating: 8.5,
      releaseYear: 2023,
    };
    await controller.create(createMovieDto);
    expect(moviesService.create).toHaveBeenCalledWith(createMovieDto);
  });

  it('should call moviesService.findAll when findAll is called', async () => {
    await controller.findAll();
    expect(moviesService.findAll).toHaveBeenCalled();
  });

  it('should call moviesService.updateByTitle with correct data', async () => {
    const title = 'Test Movie';
    const updateMovieDto = {
      id: 1,
      title: 'Updated Test Movie',
      genre: 'Comedy',
      duration: 110,
      rating: 7.0,
      releaseYear: 2024,
    };
    await controller.update(title, updateMovieDto);
    expect(moviesService.updateByTitle).toHaveBeenCalledWith(title, updateMovieDto);
  });

  it('should call moviesService.removeByTitle with correct title', async () => {
    const title = 'Test Movie';
    await controller.remove(title);
    expect(moviesService.removeByTitle).toHaveBeenCalledWith(title);
  });

});