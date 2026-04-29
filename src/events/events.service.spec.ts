import { Test, TestingModule } from '@nestjs/testing';
import { SseRegistryService } from './events.service';

describe('EventsService', () => {
  let service: SseRegistryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SseRegistryService],
    }).compile();

    service = module.get<SseRegistryService>(SseRegistryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
