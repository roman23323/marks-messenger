import { Module } from '@nestjs/common';
import { RoomController } from './room.controller';
import { RoomService } from './room.service';
import { EventsModule } from 'src/events/events.module';
import { SseRegistryService } from 'src/events/events.service';

@Module({
  imports: [EventsModule],
  controllers: [RoomController],
  providers: [RoomService, SseRegistryService]
})
export class RoomModule {}
