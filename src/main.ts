import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Vet Clinic API')
    .setDescription('API para gerenciamento de clínica veterinária')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  const swaggerPath = 'docs';
  SwaggerModule.setup(swaggerPath, app, document);

  const port = Number(process.env.APP_PORT) || 3000;
  await app.listen(port, '0.0.0.0');

  const host = process.env.APP_HOST || 'localhost';
  const base = `http://${host}:${port}`;
  Logger.log(`✅ MeuPet rodando em: ${base}`);
  Logger.log(`📘 Swagger UI: ${base}/${swaggerPath}`);
  Logger.log(`🩺 OpenAPI JSON: ${base}/${swaggerPath}-json`);
}

bootstrap();
