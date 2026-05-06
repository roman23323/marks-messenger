import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { Observable, Subject } from 'rxjs';

export interface SseEvent {
    type: 'progress' | 'complete' | 'error';
    data: any;
    id?: string;
}

interface Room {
    subject: Subject<SseEvent>;
    subCount: number;
}

@Injectable()
export class SseRegistryService implements OnModuleDestroy {
    private readonly connections = new Map<string, Room>();

    subscribe(roomId: string): Observable<SseEvent> {
        return new Observable<SseEvent>((observer) => {
            const room = this.getOrCreateRoom(roomId);

            room.subCount++;

            const sub = room.subject.subscribe(observer);

            return () => {
                sub.unsubscribe();
                this.handleDisconnect(roomId);
            }
        });
    }

    publish(roomId: string, event: SseEvent): boolean {
        const room = this.connections.get(roomId);
        if (!room || room.subCount <= 0) {
            console.log(`Поток комнаты ${roomId} закрылся во время публикации события!`);
            return false;
        }

        room.subject.next(event);
        return true;
    }

    private handleDisconnect(roomId: string) {
        const room = this.connections.get(roomId);
        if (!room) return;

        room.subCount--;

        if (room.subCount <= 0) {
            room.subject.complete();
            this.connections.delete(roomId);
        }
    }

    private getOrCreateRoom(roomId: string): Room {
        let room = this.connections.get(roomId);
        if (!room) {
            room = {
                subject: new Subject<SseEvent>,
                subCount: 0
            };
            this.connections.set(roomId, room);
        }
        return room;
    }

    onModuleDestroy() {
        this.connections.forEach((room) => room.subject.complete());
        this.connections.clear();
    }
}
