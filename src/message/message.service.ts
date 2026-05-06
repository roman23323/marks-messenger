import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bullmq';
import { SendMessageDto } from './dto/send-message.dto';

export interface Message extends SendMessageDto {
    userId: number
}

@Injectable()
export class MessageService {
    constructor(
        @InjectQueue('messages')
        private readonly messageQueue: Queue<Message>,
    ) {}

    async processMessage(message: Message) {
        try {
            const job = await this.messageQueue.add(
                'send-message',
                message,
                {
                    removeOnComplete: true,
                },
            );
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
}
