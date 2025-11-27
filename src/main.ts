import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import {
  ClassSerializerInterceptor,
  Logger,
  ValidationPipe,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      transformOptions: {
        excludeExtraneousValues: false,
        enableImplicitConversion: true,
      },
      whitelist: true,
      forbidNonWhitelisted: false,
    }),
  );

  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  const config = new DocumentBuilder()
    .setTitle('Vet Clinic API')
    .setDescription('API para gerenciamento de clínica veterinária')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  const swaggerPath = 'docs';
  SwaggerModule.setup(swaggerPath, app, document);

  const port = Number(process.env.PORT) || Number(process.env.APP_PORT) || 3000;
  await app.listen(port, '0.0.0.0');

  const isProduction = process.env.NODE_ENV === 'production';
  const host = process.env.APP_HOST || 'localhost';
  const protocol = isProduction ? 'https' : 'http';
  const base = `${protocol}://${host}:${port}`;

  Logger.log(`✅ MeuPet rodando em: ${base}`);
  Logger.log(`📘 Swagger UI: ${base}/${swaggerPath}`);
  Logger.log(`🩺 OpenAPI JSON: ${base}/${swaggerPath}-json`);
}

bootstrap();
