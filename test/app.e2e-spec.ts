import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { DatabaseService } from '../src/database/database.service';

describe('AppController (e2e) - Full User Interaction', () => {
  let app: INestApplication;
  let databaseService: DatabaseService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    databaseService = moduleFixture.get<DatabaseService>(DatabaseService);
    await app.init();

    await databaseService.booking.deleteMany();
    await databaseService.showtime.deleteMany();
    await databaseService.movie.deleteMany();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should simulate a full user interaction: create movie, showtime, and booking', async () => {
    const movieResponse = await request(app.getHttpServer())
      .post('/movies')
      .send({
        title: `Interaction Movie ${Date.now()}`,
        genre: 'Adventure',
        duration: 135,
        rating: 8.0,
        releaseYear: 2023,
      })
      .expect(201);

    const movieId = movieResponse.body.id;

    const showtimeResponse = await request(app.getHttpServer())
      .post('/showtimes')
      .send({
        movie: { connect: { id: movieId } },
        theater: 'Theater C',
        startTime: '2023-10-28T14:00:00Z',
        endTime: '2023-10-28T16:15:00Z',
        price: 18.00,
      })
      .expect(201);

    const showtimeId = showtimeResponse.body.id;

    const bookingResponse = await request(app.getHttpServer())
      .post('/bookings')
      .send({
        seatNumber: 10,
        userId: 'user456',
        showtime: { connect: { id: showtimeId } },
      })
      .expect(201);

    const bookingId = bookingResponse.body.bookingId;

    const getAllBookingsResponse = await request(app.getHttpServer())
      .get('/bookings/all')
      .expect(200);

    const bookings = getAllBookingsResponse.body;
    const foundBooking = bookings.find(
      (booking: any) => booking.id === bookingId,
    );

    expect(foundBooking).toBeDefined();
    expect(foundBooking.seatNumber).toBe(10);
    expect(foundBooking.userId).toBe('user456');
    expect(foundBooking.showtimeId).toBe(showtimeId);
  });

  // Edge Cases
  describe('Edge Cases', () => {
    // Movies Edge Cases
    describe('Movies Edge Cases', () => {
      it('should return 400 for invalid movie data', async () => {
        await request(app.getHttpServer())
          .post('/movies')
          .send({
            title: '',
            genre: 'Action',
            duration: -10,
            rating: 11,
            releaseYear: 2025,
          })
          .expect(400);
      });

      it('should return 404 for updating a non-existent movie', async () => {
        await request(app.getHttpServer())
          .post('/movies/update/NonExistentMovie')
          .send({ title: 'Updated Movie' })
          .expect(404);
      });

      it('should return 404 for deleting a non-existent movie', async () => {
        await request(app.getHttpServer())
          .delete('/movies/NonExistentMovie')
          .expect(404);
      });
    });

    // Showtimes Edge Cases
    describe('Showtimes Edge Cases', () => {
      let movieId: number;

      beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
          imports: [AppModule],
        }).compile();
    
        app = moduleFixture.createNestApplication();
        databaseService = moduleFixture.get<DatabaseService>(DatabaseService);
        await app.init();
    
        await databaseService.booking.deleteMany();
        await databaseService.showtime.deleteMany();
        await databaseService.movie.deleteMany();
      });
    
      afterAll(async () => {
        await app.close();
      });

      beforeEach(async () => {

        const moduleFixture: TestingModule = await Test.createTestingModule({
          imports: [AppModule],
        }).compile();
    
        app = moduleFixture.createNestApplication();
        databaseService = moduleFixture.get<DatabaseService>(DatabaseService);
        await app.init();
    
        await databaseService.booking.deleteMany();
        await databaseService.showtime.deleteMany();
        await databaseService.movie.deleteMany();
        
        const movieResponse = await request(app.getHttpServer())
          .post('/movies')
          .send({
            title: `Edge Showtime Movie ${Date.now()}`,
            genre: 'Comedy',
            duration: 110,
            rating: 7.5,
            releaseYear: 2023,
          })
          .expect(201);
        movieId = movieResponse.body.id;
      });

      it('should return 400 for invalid showtime data', async () => {
        await request(app.getHttpServer())
          .post('/showtimes')
          .send({
            movie: { connect: { id: movieId } },
            theater: '',
            startTime: 'invalid-date',
            endTime: 'invalid-date',
            price: -5,
          })
          .expect(400);
      });

      it('should return 404 for getting a non-existent showtime', async () => {
        await request(app.getHttpServer())
          .get('/showtimes/99999')
          .expect(404);
      });

      it('should return 404 for updating a non-existent showtime', async () => {
        await request(app.getHttpServer())
          .post('/showtimes/update/99999')
          .send({ theater: 'Updated Theater' })
          .expect(404);
      });

      it('should return 404 for deleting a non-existent showtime', async () => {
        await request(app.getHttpServer())
          .delete('/showtimes/99999')
          .expect(404);
      });

      it('should return 409 for overlapping showtimes', async () => {
        const movieResponse = await request(app.getHttpServer())
          .post('/movies')
          .send({
            title: `Overlapping Movie ${Date.now()}`,
            genre: 'Sci-Fi',
            duration: 120,
            rating: 8.8,
            releaseYear: 2023,
          })
          .expect(201);

        const movieId = movieResponse.body.id;

        await request(app.getHttpServer())
          .post('/showtimes')
          .send({
            movie: { connect: { id: movieId } },
            theater: 'Theater E',
            startTime: '2023-10-30T10:00:00Z',
            endTime: '2023-10-30T12:00:00Z',
            price: 15.00,
          })
          .expect(201);

        await request(app.getHttpServer())
          .post('/showtimes')
          .send({
            movie: { connect: { id: movieId } },
            theater: 'Theater E',
            startTime: '2023-10-30T11:00:00Z',
            endTime: '2023-10-30T13:00:00Z',
            price: 16.00,
          })
          .expect(409);
      });
    });

    // Bookings Edge Cases
    describe('Bookings Edge Cases', () => {
      let showtimeId: number;
    
      afterAll(async () => {
        await app.close();
      });

      beforeEach(async () => {

        const moduleFixture: TestingModule = await Test.createTestingModule({
          imports: [AppModule],
        }).compile();
    
        app = moduleFixture.createNestApplication();
        databaseService = moduleFixture.get<DatabaseService>(DatabaseService);
        await app.init();
    
        await databaseService.booking.deleteMany();
        await databaseService.showtime.deleteMany();
        await databaseService.movie.deleteMany();

        const movieResponse = await request(app.getHttpServer())
          .post('/movies')
          .send({
            title: `Edge Booking Movie ${Date.now()}`,
            genre: 'Thriller',
            duration: 140,
            rating: 8.2,
            releaseYear: 2023,
          })
          .expect(201);

        const showtimeResponse = await request(app.getHttpServer())
          .post('/showtimes')
          .send({
            movie: { connect: { id: movieResponse.body.id } },
            theater: 'Theater D',
            startTime: '2023-10-29T18:00:00Z',
            endTime: '2023-10-29T20:20:00Z',
            price: 20.00,
          })
          .expect(201);
        showtimeId = showtimeResponse.body.id;
      });

      it('should return 400 for invalid booking data',
        async () => {
          await request(app.getHttpServer())
            .post('/bookings')
            .send({
              seatNumber: -1,
              userId: '',
              showtime: { connect: { id: showtimeId } },
            })
            .expect(400);
        });
  
        it('should return 404 for deleting a non-existent booking', async () => {
          await request(app.getHttpServer())
            .delete('/bookings/nonexistent-booking-id')
            .expect(404);
        });
  
        it('should return 409 for duplicate booking', async () => {
          await request(app.getHttpServer())
            .post('/bookings')
            .send({
              seatNumber: 1,
              userId: 'user1',
              showtime: { connect: { id: showtimeId } },
            })
            .expect(201);
  
          await request(app.getHttpServer())
            .post('/bookings')
            .send({
              seatNumber: 1,
              userId: 'user2',
              showtime: { connect: { id: showtimeId } },
            })
            .expect(409);
        });
      });
    });
  });