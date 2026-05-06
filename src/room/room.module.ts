import { Module } from '@nestjs/common';
import { RoomController } from './room.controller';
import { RoomService } from './room.service';
import { EventsModule } from 'src/events/events.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [EventsModule, AuthModule],
  controllers: [RoomController],
  providers: [RoomService],
})
export class RoomModule {}
