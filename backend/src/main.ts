import 'reflect-metadata';
import { NestFactory, Reflector } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { ValidationPipe, ClassSerializerInterceptor } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { UnauthorizedExceptionFilter } from './auth/filters/unauthorized-exception/unauthorized-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
  app.useGlobalFilters(new UnauthorizedExceptionFilter());
  app.use(cookieParser());
  // Enable CORS for the React frontend
  // app.enableCors();
  app.setGlobalPrefix('api');

  const config = new DocumentBuilder()
    .setTitle('SkyRunRentals API')
    .setDescription('The administrative and client-facing API for SkyRunRentals')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);

  // Rewrite /admin to /api/admin internally for page rendering
  app.use((req: any, res: any, next: any) => {
    if (req.method === 'GET' && req.path.startsWith('/admin') && !req.path.startsWith('/api')) {
      req.url = '/api' + req.url;
    }
    next();
  });

  app.enableCors({
    origin: [
      'http://localhost:5173',
    ],
    credentials: true,
  });

  // Configure MVC for EJS
  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.setViewEngine('ejs');

  // Frontend SPA Fallback
  const expressApp = app.getHttpAdapter().getInstance();
  expressApp.use((req: any, res: any, next: any) => {
    if (req.method !== 'GET') {
      return next();
    }
    if (req.path.startsWith('/api')) {
      return next();
    }
    if (req.path.match(/\.[^\/]+$/)) {
      return next();
    }
    res.sendFile(join(__dirname, '..', 'public', 'index.html'));
  });

  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  console.log(`Backend is running on: http://localhost:${port}`);
}
bootstrap();
