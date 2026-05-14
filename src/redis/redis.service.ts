import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

@Injectable()
export class RedisService {
    private readonly redis: Redis;

    constructor(private readonly configModule: ConfigService) {
        this.redis = new Redis({
            host: configModule.get<string>('REDIS_URL'),
            port: configModule.get<number>('REDIS_PORT')
        })
    }

    async addUserToRoom(roomId: string, userId: number) {
        await this.redis.sadd(`room:${roomId}`, userId);
    }

    async removeUserFromRoom(roomId: string, userId: number) {
        await this.redis.srem(`room:${roomId}`, userId);
    }

    async getRoomMemers(roomId: string): Promise<string[]> {
        return this.redis.smembers(`room:${roomId}`);
    }
}
