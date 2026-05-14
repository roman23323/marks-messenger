import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { Observable, Subject } from 'rxjs';
import { RedisService } from '../redis/redis.service';
import { ChatMessage } from 'src/redis/types/ChatMessage';

@Injectable()
export class SseRegistryService implements OnModuleDestroy {
    constructor(private readonly redisService: RedisService) {}

    private readonly connections = new Map<number, Subject<ChatMessage>[]>();

    subscribe(userId: number): Observable<ChatMessage> {
        return new Observable<ChatMessage>((observer) => {
            let conns = this.connections.get(userId);
            if (!conns) {
                conns = [];
                this.connections.set(userId, conns);
            }

            const subject = new Subject<ChatMessage>(); 
            conns.push(subject);

            const sub = subject.subscribe(observer);

            return () => {
                sub.unsubscribe();
                this.handleDisconnect(userId, subject);
            }
        });
    }

    async publish(message: ChatMessage) {
        const roomId = message.roomId;
        const userIds = await this.redisService.getRoomMembers(roomId);
        for (const userId of userIds) {
            const conns = this.connections.get(parseInt(userId));
            if (!conns || conns.length <= 0) {
                console.log(`Пользователь ${userId} оффлайн, ему нельзя доставить сообщение!`);
            } else {
                conns.forEach(conn => conn.next(message));
            }
        }
    }

    private handleDisconnect(userId: number, sub: Subject<ChatMessage>) {
        let conns = this.connections.get(userId);
        if (!conns) return;
        conns = conns?.filter(s => s !== sub);
        if (conns.length == 0) this.connections.delete(userId);
    }

    onModuleDestroy() {
        this.connections.forEach((conns) => conns.forEach(conn => conn.complete()));
        this.connections.clear();
    }
}
