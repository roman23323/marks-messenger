import { Body, Controller, MessageEvent, Param, Post, Req, Sse, UseGuards } from '@nestjs/common';
import { Observable } from 'rxjs';
import { AuthGuard } from '../auth/auth.guard';
import { SseRegistryService } from '../events/events.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { RoomService } from './room.service';

@Controller('room')
export class RoomController {
  constructor(
    private readonly sseRegistry: SseRegistryService,
    private readonly roomService: RoomService
  ) {}

  @UseGuards(AuthGuard)
  @Sse('/stream')
  streamEvents(@Req() request): Observable<MessageEvent> {
    const userId = request['user'].sub;
    console.log('Подключение пользователя: ', userId);
    return this.sseRegistry.subscribe(userId);
  }

  @UseGuards(AuthGuard)
  @Post()
  async createRoom(@Body() { name }: CreateRoomDto) {
    return { roomId: await this.roomService.createRoom(name) };
  }
}
