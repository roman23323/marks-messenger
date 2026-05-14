import { Injectable, OnModuleInit } from "@nestjs/common";
import { RedisService } from "../redis.service";
import { SseRegistryService } from "src/events/events.service";
import { ChatMessage } from "../types/ChatMessage";

@Injectable()
export class RoomEventsConsumer implements OnModuleInit {
    constructor (
        private readonly redisService: RedisService,
        private readonly sseRegistry: SseRegistryService
    ) {}
    
    async onModuleInit() {
        await this.redisService.subscribe(
            'chat',
            this.publishMessage.bind(this)
        );
    }

    private publishMessage(message: ChatMessage) {
        this.sseRegistry.publish(message);
    }
}