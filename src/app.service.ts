import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Welcome to Popcorn Palace Movie Ticket Booking System!';
  }
}
