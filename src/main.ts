import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './modules/main/app.module';
import { setupSwagger } from './swagger';
import { useContainer } from 'class-validator';
import { TrimStringsPipe } from 'modules/common/transformer/trim-strings.pipe';
const {info} = require('./utils/logger');

async function bootstrap() {

  const app = await NestFactory.create(AppModule);
  setupSwagger(app);
  app.enableCors();
  app.useGlobalPipes(new TrimStringsPipe(), new ValidationPipe());
  useContainer(app.select(AppModule), { fallbackOnErrors: true });
  await app.listen(process.env.APPSETTING_PORT || 3000);
  info("Application listening on port : "+3000,__filename,"bootstrap()");
}
bootstrap();
