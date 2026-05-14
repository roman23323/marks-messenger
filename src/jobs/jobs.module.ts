import { Module } from '@nestjs/common';
import { JobsService } from './jobs.service';
import { EventsModule } from '../events/events.module';
import { RedisModule } from '../redis/redis.module';

@Module({
  imports: [EventsModule, RedisModule],
  providers: [JobsService],
  exports: [JobsService]
})
export class JobsModule {}
