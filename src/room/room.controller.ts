import { Body, Controller, Get, Param, Post, Query, Req, Sse, UseGuards } from '@nestjs/common';
import { Observable } from 'rxjs';
import { AuthGuard } from '../auth/auth.guard';
import { SseRegistryService } from '../events/events.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { RoomService } from './room.service';
import { ChatMessage } from '../redis/types/ChatMessage';

@Controller('room')
export class RoomController {
  constructor(
    private readonly sseRegistry: SseRegistryService,
    private readonly roomService: RoomService
  ) {}

  @UseGuards(AuthGuard)
  @Sse('/stream')
  streamEvents(@Req() request): Observable<ChatMessage> {
    const userId = request['user'].sub;
    console.log('Подключение пользователя: ', userId);
    return this.sseRegistry.subscribe(userId);
  }

  @UseGuards(AuthGuard)
  @Post()
  async createRoom(@Body() { name }: CreateRoomDto) {
    return { roomId: await this.roomService.createRoom(name) };
  }

  @UseGuards(AuthGuard)
  @Post('/join/:roomId')
  async joinRoom(
    @Param('roomId') roomId: string,
    @Req() request
  ) {
    const userId = request['user'].sub;
    return await this.roomService.joinRoom(roomId, userId);
  }

  @UseGuards(AuthGuard)
  @Post('/quit/:roomId')
  async quitRoom(
    @Param('roomId') roomId: string,
    @Req() request
  ) {
    const userId = request['user'].sub;
    return await this.roomService.quitRoom(roomId, userId);
  }

  @UseGuards(AuthGuard)
  @Get('/:roomId/messages')
  fetchHistory(
    @Req() request,
    @Param('roomId') roomId: string,
    @Query('limit') limit?: number,
    @Query('before') before?: string,
    @Query('after') after?: string
  ) {
    const userId = request['user'].sub;
    const messages = this.roomService.fetchHistory(userId, roomId, limit, before, after);
    return messages;
  }

  @UseGuards(AuthGuard)
  @Get('/list')
  roomList() {
    return this.roomService.getRoomList();
  }
}
