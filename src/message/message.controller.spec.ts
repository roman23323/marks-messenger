import { Test, TestingModule } from '@nestjs/testing';
import { MessageController } from './message.controller';
import { beforeEach, describe, expect, it } from 'bun:test';

describe('MessageController', () => {
  let controller: MessageController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MessageController],
    }).compile();

    controller = module.get<MessageController>(MessageController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
