import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { sleep } from 'bun';
import { SseEvent, SseRegistryService } from '../events/events.service';
import { Message } from '../message/message.service';
import { PrismaService } from '../prisma/prisma.service';

@Processor('messages')
export class JobsService extends WorkerHost {
    private readonly usersRooms = new Map<string, number[]>;

    constructor(
        private readonly sseRegistry: SseRegistryService,
        private readonly prisma: PrismaService
    ) {
        super();
    }

    async process(job: Job<Message, any, string>): Promise<any> {
        const { userId, roomId, text } = job.data;
        console.log('Обработка Job');
        try {
            this.publishToRoomMembers(roomId, {
                type: 'progress',
                data: {
                    id: 'progress-message',
                    userId: 0,
                    roomId: '0',
                    text: 'Обработка сообщения'
                }
            });

            const result = `Обработанно: ${text}`;
            await sleep(5000);
            const messageProcessed = await this.prisma.message.create({
                data: {
                    room: {
                        connect: { id: roomId }
                    },
                    message: result,
                    user: {
                        connect: { id: userId }
                    }
                }
            });
    
            this.publishToRoomMembers(roomId, {
                type: 'complete',
                data: {
                    roomId,
                    userId,
                    text: messageProcessed.message,
                    id: messageProcessed.id
                },
                id: job.id,
            });

            return result;
        } catch (error) {
            this.publishToRoomMembers(roomId, {
                type: 'error',
                data: {
                    id: 'error-message',
                    userId: 0,
                    roomId: '0',
                    text: 'Ошибка при публикации сообщения'
                }
            });
            throw error;
        }
    }

    private async getRoomMemberIds(roomId: string) {
        if (!this.usersRooms.has(roomId)) {
            const roomUsers = await this.prisma.usersToRooms.findMany({
                where: {
                    roomId
                },
                select: {
                    userId: true
                }
            });
            const members = roomUsers.map(u => u.userId);
            this.usersRooms.set(roomId, members);
        }
        return this.usersRooms.get(roomId)!;
    }

    private async publishToRoomMembers(roomId: string, event: SseEvent) {
        const connectedMembersIds = await this.getRoomMemberIds(roomId);
        console.log('Получатели:', connectedMembersIds);
        connectedMembersIds?.forEach(id => this.sseRegistry.publish(id, event));
    }
}
