import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { sleep } from 'bun';
import { SseRegistryService } from '../events/events.service';
import { Message } from '../message/message.service';
import { PrismaService } from '../prisma/prisma.service';

@Processor('messages')
export class JobsService extends WorkerHost {

    constructor(
        private readonly sseRegistry: SseRegistryService,
        private readonly prisma: PrismaService
    ) {
        super();
    }

    async process(job: Job<Message, any, string>): Promise<any> {
        const { userId, roomId, text } = job.data;

        try {    
            this.sseRegistry.publish(roomId, {
                type: 'progress',
                data: { message: 'Processing...' }
            });

            const result = `Обработанно: ${text}`;
            await sleep(5000);
            await this.prisma.message.create({
                data: {
                    room: {
                        connect: { id: roomId }
                    },
                    message: result,
                    user: {
                        connect: { id: userId }
                    }
                }
            });
    
            this.sseRegistry.publish(roomId, {
                type: 'complete',
                data: { message: result },
                id: job.id,
            });

            return result;
        } catch (error) {
            this.sseRegistry.publish(roomId, {
                type: 'error',
                data: { message: error.message },
            });
            throw error;
        }
    }
}
