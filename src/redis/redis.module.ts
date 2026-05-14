import { forwardRef, Module } from '@nestjs/common';
import { RedisService } from './redis.service';
import { RoomEventsConsumer } from './events-consumer/RoomEventsConsumer';
import { EventsModule } from '../events/events.module';

@Module({
  imports: [forwardRef(() => EventsModule)],
  providers: [RedisService, RoomEventsConsumer],
  exports: [RedisService]
})
export class RedisModule {}
