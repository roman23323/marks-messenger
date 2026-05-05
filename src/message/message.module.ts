import { Module } from '@nestjs/common';
import { MessageService } from './message.service';
import { MessageController } from './message.controller';
import { BullModule } from '@nestjs/bullmq';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'messages',
    }),
  ],
  providers: [MessageService],
  controllers: [MessageController]
})
export class MessageModule {}
