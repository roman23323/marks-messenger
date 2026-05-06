import { Controller, MessageEvent, Param, Sse } from '@nestjs/common';
import { Observable, finalize } from 'rxjs';
import { AuthGuard } from 'src/auth/auth.guard';
import { SseRegistryService } from 'src/events/events.service';

@Controller('room')
export class RoomController {
  constructor(private readonly sseRegistry: SseRegistryService) {}

  @UseGuards(AuthGuard)
  @Sse(':roomId')
  streamEvents(@Param('roomId') roomId: string): Observable<MessageEvent> {
    console.log('Подключение к комнате по id: ', roomId);
    return this.sseRegistry.subscribe(roomId);
  }
}
