import { Module } from '@nestjs/common';
import { JobsService } from './jobs.service';
import { EventsModule } from 'src/events/events.module';

@Module({
  providers: [JobsService],
  imports: [EventsModule],
})
export class JobsModule {}
