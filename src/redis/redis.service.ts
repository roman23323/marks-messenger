import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';
import { ChatMessage } from './types/ChatMessage';

@Injectable()
export class RedisService {
    private readonly redisPub: Redis;
    private readonly redisSub: Redis;

    constructor(private readonly configModule: ConfigService) {
        this.redisPub = new Redis({
            host: configModule.get<string>('REDIS_URL'),
            port: configModule.get<number>('REDIS_PORT')
        });
        this.redisSub = this.redisPub.duplicate();
    }

    async publish(channel: string, payload: ChatMessage) {
        this.redisPub.publish(channel, JSON.stringify(payload))
    }

    async subscribe(
        channel: string,
        handler: (message: any) => void
    ) {
        await this.redisSub.subscribe(channel);

        this.redisSub.on('message', (ch, message) => {
            if (ch !== channel) return;

            handler(JSON.parse(message));
        })
    }

    async addUserToRoom(roomId: string, userId: number) {
        await this.redisPub.sadd(`room:${roomId}`, userId);
    }

    async removeUserFromRoom(roomId: string, userId: number) {
        await this.redisPub.srem(`room:${roomId}`, userId);
    }

    async getRoomMembers(roomId: string): Promise<string[]> {
        return this.redisPub.smembers(`room:${roomId}`);
    }
}
