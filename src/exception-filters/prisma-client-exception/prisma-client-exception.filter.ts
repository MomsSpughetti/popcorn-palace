import { ArgumentsHost, Catch, HttpStatus } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { Prisma } from '@prisma/client';
import { Response } from 'express';


@Catch(Prisma.PrismaClientValidationError)
export class InputValidationFilter extends BaseExceptionFilter {
  catch(exception: Prisma.PrismaClientValidationError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();

    const response = ctx.getResponse<Response>();
    const message = exception.message;

    const status = HttpStatus.BAD_REQUEST;
    response.status(status).json({
      statusCode: status,
      message: message,
    });
  }
}
