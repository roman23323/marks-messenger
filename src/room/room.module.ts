import { Module } from '@nestjs/common';
import { MessageService } from './message/message.service';

@Module({
  providers: [MessageService]
})
export class RoomModule {}
