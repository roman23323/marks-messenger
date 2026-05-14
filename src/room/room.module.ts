import { Module } from '@nestjs/common';
import { RoomController } from './room.controller';
import { RoomService } from './room.service';
import { EventsModule } from '../events/events.module';
import { AuthModule } from '../auth/auth.module';
import { JobsModule } from '../jobs/jobs.module';

@Module({
  imports: [EventsModule, AuthModule, JobsModule],
  controllers: [RoomController],
  providers: [RoomService],
})
export class RoomModule {}
