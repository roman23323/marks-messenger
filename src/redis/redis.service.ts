import { Injectable, Logger, OnApplicationShutdown } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';
import { ChatMessage } from './types/ChatMessage';

@Injectable()
export class RedisService implements OnApplicationShutdown {
    private readonly logger = new Logger(RedisService.name);
    private readonly redisPub: Redis;
    private readonly redisSub: Redis;

    constructor(private readonly configService: ConfigService) {
        this.redisPub = new Redis(configService.getOrThrow('REDIS_URL'), {
            maxRetriesPerRequest: null,
            retryStrategy: (times) => Math.min(times * 50, 2000),
            reconnectOnError: (err: any) => {
                return err && ['ECONNREFUSED', 'ENOTFOUND', 'ESERVFAIL'].includes(err.code);
            },
        });

        this.redisPub.on('error', (error) => {
            console.error('Redis publisher error:', error);
        });

        this.redisSub = this.redisPub.duplicate();
        this.redisSub.on('error', (error) => {
            console.error('Redis subscriber error:', error);
        });
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

    async onApplicationShutdown(signal?: string) {
        this.logger.log(`Получен сигнал: ${signal}. Закрытие соединения Redis...`);

        await this.redisPub.quit();
        await this.redisSub.quit();

        this.logger.log('Соединение с Redis закрыто успешно.');
    }
}
