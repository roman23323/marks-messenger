import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { sleep } from 'bun';
import { Message } from '../message/message.service';
import { PrismaService } from '../prisma/prisma.service';
import { RedisService } from '../redis/redis.service';

@Processor('messages')
export class JobsService extends WorkerHost {
    constructor(
        private readonly redisService: RedisService,
        private readonly prisma: PrismaService
    ) {
        super();
    }

    async process(job: Job<Message, any, string>): Promise<any> {
        const { userId, roomId, text } = job.data;
        console.log('Обработка Job');
        try {
            this.redisService.publish('chat', {
                type: 'processing',
                roomId,
                userId
            });

            const result = `Обработанно: ${text}`;
            await sleep(5000);
            const messageProcessed = await this.prisma.message.create({
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

            this.redisService.publish('chat', {
                type: 'new-message',
                roomId,
                userId,
                data: {
                    id: messageProcessed.id,
                    text: messageProcessed.message
                }
            });

            return result;
        } catch (error) {
            this.redisService.publish('chat', {
                type: 'error',
                roomId,
                userId
            })
            throw error;
        }
    }
}
