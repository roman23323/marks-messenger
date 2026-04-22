import { Test, TestingModule } from '@nestjs/testing';
import { MessageService } from './message.service';
import { describe, beforeEach, it, expect } from 'bun:test';

describe('MessageService', () => {
  let service: MessageService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MessageService],
    }).compile();

    service = module.get<MessageService>(MessageService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
