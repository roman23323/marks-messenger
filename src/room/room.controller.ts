import { Body, Controller, MessageEvent, Param, Post, Sse, UseGuards } from '@nestjs/common';
import { Observable } from 'rxjs';
import { AuthGuard } from 'src/auth/auth.guard';
import { SseRegistryService } from 'src/events/events.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { RoomService } from './room.service';

@Controller('room')
export class RoomController {
  constructor(
    private readonly sseRegistry: SseRegistryService,
    private readonly roomService: RoomService
  ) {}

  @UseGuards(AuthGuard)
  @Sse(':roomId')
  streamEvents(@Param('roomId') roomId: string): Observable<MessageEvent> {
    console.log('Подключение к комнате по id: ', roomId);
    return this.sseRegistry.subscribe(roomId);
  }

  @UseGuards(AuthGuard)
  @Post()
  async createRoom(@Body() { name }: CreateRoomDto) {
    return { roomId: await this.roomService.createRoom(name) };
  }
}
