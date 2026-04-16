import { Test, TestingModule } from '@nestjs/testing';
import { SocketIOGateway } from './web-socket.gateway';
import { beforeEach, describe, expect, it } from 'bun:test';

describe('WebSocketGateway', () => {
  let gateway: SocketIOGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SocketIOGateway],
    }).compile();

    gateway = module.get<SocketIOGateway>(SocketIOGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
