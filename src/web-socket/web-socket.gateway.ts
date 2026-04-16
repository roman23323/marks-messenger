import { MessageBody, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer, WsException } from '@nestjs/websockets';
import type { WsResponse } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { SendMessageDto } from './dto/send-message.dto';
import { UseFilters, UsePipes, ValidationPipe } from '@nestjs/common';
import { AcknowledgeMessageDto } from './dto/acknowledge-message.dto';
import { WsValidationExceptionFilter } from 'src/filters/ws-validation-exception.filter';

const WS_PORT = Number(process.env.WS_PORT) || 3001

@UseFilters(new WsValidationExceptionFilter())
@WebSocketGateway(WS_PORT)
export class SocketIOGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;
  
  afterInit() {
    console.log(`WebSocket-шлюз запущен на порту ${WS_PORT}`);
  }

  handleConnection(client: Socket) {
    console.log(`Подключён новый клиент ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Клиент ${client.id} отключён.`);
  }

  @SubscribeMessage('ping')
  handlePing(): WsResponse<string> {
    console.log('Сообщение ping');
    return {
      event: 'pong',
      data: 'pong'
    };
  }

  @SubscribeMessage('message:new')
  @UsePipes(new ValidationPipe({
    exceptionFactory: (errors) => new WsException(errors)
  }))
  handleNewMessage(
    @MessageBody() sendMessageDto: SendMessageDto
  ): WsResponse<AcknowledgeMessageDto> {
    return {
      event: 'message:ack',
      data: { status: 'received', requestId: sendMessageDto.requestId }
    }
  }
}
