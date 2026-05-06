import { Module } from '@nestjs/common';
import { SseRegistryService } from './events.service';

@Module({
  providers: [SseRegistryService],
  exports: [SseRegistryService],
})
export class EventsModule {}
