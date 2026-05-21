import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { PrismaClientExceptionFilter } from 'nestjs-prisma';
import { JsonLogger } from './json-logger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: new JsonLogger()
  });

  const { httpAdapter } = app.get(HttpAdapterHost);
  app.useGlobalFilters(new PrismaClientExceptionFilter(httpAdapter));

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true
    })
  );
  console.log('Сервер запущен на порту 3000')
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
