import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { sleep } from 'bun';
import { SseRegistryService } from 'src/events/events.service';
import { MessageJobData } from 'src/room/message/message.service';

@Processor('messages')
export class JobsService extends WorkerHost {

    constructor(
        private readonly sseRegistry: SseRegistryService,
    ) {
        super();
    }

    async process(job: Job<MessageJobData, any, string>): Promise<any> {
        const { requestId, roomId, text } = job.data;

        try {    
            this.sseRegistry.publish(roomId, {
                type: 'progress',
                data: { message: 'Processing...' }
            });

            const result = `Обработанно: ${job.data.text}`;
            await sleep(5000);
    
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
