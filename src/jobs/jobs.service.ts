import { InjectQueue, Processor, WorkerHost } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { Job } from 'bullmq';
import { MessageJobData } from 'src/room/message/message.service';

@Processor('messages')
export class JobsService extends WorkerHost {

    constructor() {
        // Здесь будет инъекция AI-сервиса для запросов на API
        super();
    }

    async process(job: Job<MessageJobData, any, string>, token?: string): Promise<any> {
        
    }
}
