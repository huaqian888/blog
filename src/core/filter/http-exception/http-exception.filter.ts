import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const status = response.getStatus();

    const message = exception.message
      ? exception.message
      : `${status > 500 ? 'Service Error' : 'Client Error'}`;

    const errorRes = {
      data: {},
      code: -1,
      message,
    };

    response.status(status);
    response.header('Content-Type', 'application/json; charset=utf-8');
    response.send(errorRes);
  }
}
