import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './modules/main/app.module';
import { setupSwagger } from './swagger';
import { useContainer } from 'class-validator';
import { TrimStringsPipe } from 'modules/common/transformer/trim-strings.pipe';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  setupSwagger(app);


     


  console.log('type = '+`${process.env.POSTGRESQL_DB_TYPE}`);
  console.log('POSTGRESQL_DB_HOST = '+`${process.env.POSTGRESQL_DB_HOST}`);
  console.log('POSTGRESQL_DB_PORT = '+`${process.env.POSTGRESQL_DB_PORT}`);
  console.log('POSTGRESQL_DB_USERNAME = '+`${process.env.POSTGRESQL_DB_USERNAME}`);
  console.log('POSTGRESQL_DB_PASSWORD = '+`${process.env.POSTGRESQL_DB_PASSWORD}`);
  console.log('POSTGRESQL_DB_NAME = '+`${process.env.POSTGRESQL_DB_NAME}`);



  app.enableCors();
  app.useGlobalPipes(new TrimStringsPipe(), new ValidationPipe());
  useContainer(app.select(AppModule), { fallbackOnErrors: true });
  await app.listen(`${process.env.APP_PORT}`);
}
bootstrap();
