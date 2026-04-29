import { Controller, Param, Sse, MessageEvent } from '@nestjs/common';
import { SseRegistryService } from './events.service';
import { finalize, Observable } from 'rxjs';

@Controller('events')
export class EventsController {
    constructor(private readonly sseRegistry: SseRegistryService) {}

    @Sse(':roomId')
    streamEvents(@Param('roomId') roomId: string): Observable<MessageEvent> {
        console.log('Подключение к комнате по id: ', roomId);
        return this.sseRegistry.subscribe(roomId).pipe(
            finalize(() => {
                console.log('Отключение SSE');
                this.sseRegistry.closeRoom(roomId);
            }),
        );
    }
}
