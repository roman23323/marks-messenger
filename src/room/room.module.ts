import { Module } from '@nestjs/common';
import { MessageService } from './message/message.service';
import { BullModule } from '@nestjs/bullmq';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'messages',
    }),
  ],
  providers: [MessageService],
  exports: [MessageService],
})
export class RoomModule {}
