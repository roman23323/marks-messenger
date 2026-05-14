import { forwardRef, Module } from '@nestjs/common';
import { SseRegistryService } from './events.service';
import { RedisModule } from '../redis/redis.module';

@Module({
  imports: [forwardRef(() => RedisModule)],
  providers: [SseRegistryService],
  exports: [SseRegistryService],
})
export class EventsModule {}
