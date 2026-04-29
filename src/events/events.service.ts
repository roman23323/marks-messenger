import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { Observable, Subject } from 'rxjs';

export interface SseEvent {
    type: 'progress' | 'complete' | 'error';
    data: any;
    id?: string;
}

@Injectable()
export class SseRegistryService implements OnModuleDestroy {
    private readonly connections = new Map<string, Subject<SseEvent>>();

    subscribe(roomId: string): Observable<SseEvent> {
        if (!this.connections.has(roomId)) {
            const subject = new Subject<SseEvent>();
            this.connections.set(roomId, subject);
        }
        const subject = this.connections.get(roomId);
        if (!subject) {
            throw new Error('Поток закрылся во время попытки подписки!');
        }
        return subject.asObservable();
    }

    publish(roomId: string, event: SseEvent): boolean {
        const subject = this.connections.get(roomId);
        if (!subject) {
            console.log(`Поток комнаты ${roomId} закрылся во время публикации события!`);
            return false;
        }
        subject.next(event);
        return true;
    }

    closeRoom(roomId: string): void {
        const subject = this.connections.get(roomId);
        if (!subject) {
            console.log('Попытка повторного закрытия потока!');
            return;
        }
        subject.complete();
        this.connections.delete(roomId);
    }

    onModuleDestroy() {
        this.connections.forEach((_, roomId) => this.closeRoom(roomId));
    }
}
