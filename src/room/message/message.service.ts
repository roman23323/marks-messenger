import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bullmq';
import { SendMessageDto } from 'src/web-socket/dto/send-message.dto';

export interface MessageJobData extends SendMessageDto {}

@Injectable()
export class MessageService {
    constructor(
        @InjectQueue('messages')
        private readonly messageQueue: Queue<MessageJobData>
    ) {}

    async processMessage(message: SendMessageDto): Promise<{ jobId: string }> {
        try {
            const job = await this.messageQueue.add(
                'send-message',
                message,
                {
                    jobId: message.requestId,
                    removeOnComplete: true,
                },
            );

            return { jobId: job.id! };
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
}
