import { Module } from '@nestjs/common';
import { JobsService } from './jobs.service';
import { EventsModule } from '../events/events.module';

@Module({
  imports: [EventsModule],
  providers: [JobsService],
  exports: [JobsService]
})
export class JobsModule {}
