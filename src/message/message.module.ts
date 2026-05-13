import { Module } from '@nestjs/common';
import { MessageService } from './message.service';
import { MessageController } from './message.controller';
import { BullModule } from '@nestjs/bullmq';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'messages',
    }),
    AuthModule
  ],
  providers: [MessageService],
  controllers: [MessageController]
})
export class MessageModule {}
