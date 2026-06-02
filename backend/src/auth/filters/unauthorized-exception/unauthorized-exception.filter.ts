import { ExceptionFilter, Catch, ArgumentsHost, UnauthorizedException } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(UnauthorizedException)
export class UnauthorizedExceptionFilter implements ExceptionFilter {
  catch(exception: UnauthorizedException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const accepts = request.accepts(['html', 'json']);
    const loginUrl = `${process.env.APP_URL || 'http://localhost:5173'}/login?logout=true`;

    if (accepts === 'html') {
      response.redirect(loginUrl);
    } else {
      response.status(401).json({
        statusCode: 401,
        message: exception.message || 'Unauthorized',
      });
    }
  }
}
