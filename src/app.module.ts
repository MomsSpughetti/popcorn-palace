import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { MoviesModule } from './movies/movies.module';
import { BookingsModule } from './bookings/bookings.module';
import { ShowtimesModule } from './showtimes/showtimes.module';

@Module({
  imports: [DatabaseModule, MoviesModule, BookingsModule, ShowtimesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
