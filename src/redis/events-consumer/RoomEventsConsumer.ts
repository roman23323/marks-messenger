import { Injectable, OnModuleInit } from "@nestjs/common";
import { RedisService } from "../redis.service";
import { ChatMessage } from "../types/ChatMessage";
import { SseRegistryService } from "../../events/events.service";

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