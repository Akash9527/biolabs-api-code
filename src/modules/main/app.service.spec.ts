import { Test, TestingModule } from '@nestjs/testing';
import { AppService } from './app.service';
import { ConfigModule } from './../config';

describe('EventsService', () => {
  let service: AppService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AppService],
      imports: [ConfigModule],
    }).compile();

    service = module.get<AppService>(AppService);
  });

  it('should be defined', () => {
    expect(service.root).toBeDefined();
  });
});