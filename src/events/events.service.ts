import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { Observable, Subject } from 'rxjs';
import { Message } from '../message/message.service';

export interface SseEvent {
    type: 'progress' | 'complete' | 'error';
    data: Message;
    id?: string;
}

@Injectable()
export class SseRegistryService implements OnModuleDestroy {
    private readonly connections = new Map<number, Subject<SseEvent>[]>();

    subscribe(userId: number): Observable<SseEvent> {
        return new Observable<SseEvent>((observer) => {
            let conns = this.connections.get(userId);
            if (!conns) {
                conns = [];
                this.connections.set(userId, conns);
            }

            const subject = new Subject<SseEvent>(); 
            conns.push(subject);

            const sub = subject.subscribe(observer);

            return () => {
                sub.unsubscribe();
                this.handleDisconnect(userId, subject);
            }
        });
    }

    publish(userId: number, event: SseEvent): boolean {
        const conns = this.connections.get(userId);
        if (!conns || conns.length <= 0) {
            console.log(`Поток пользователя ${userId} закрыты на момент публикации события!`);
            return false;
        }

        conns.forEach(conn => conn.next(event));
        return true;
    }

    private handleDisconnect(userId: number, sub: Subject<SseEvent>) {
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
