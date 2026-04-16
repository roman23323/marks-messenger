import { Module } from '@nestjs/common';
import { SocketIOGateway } from './web-socket.gateway';

@Module({
  providers: [SocketIOGateway]
})
export class WebSocketModule {}
