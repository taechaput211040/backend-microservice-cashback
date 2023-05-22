import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = new DocumentBuilder()
    .setExternalDoc('asd', 'https://google.com')
    .setTitle('cashback Microservice')
    .setDescription(`API for CRUD in Static `)
    .setVersion('1.0')
    .addTag('rico','member')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  app.enableCors(); 
  await app.listen(3001);
}
bootstrap();
