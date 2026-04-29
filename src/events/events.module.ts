import { Module } from '@nestjs/common';
import { EventsController } from './events.controller';
import { SseRegistryService } from './events.service';

@Module({
  controllers: [EventsController],
  providers: [SseRegistryService],
  exports: [SseRegistryService],
})
export class EventsModule {}
