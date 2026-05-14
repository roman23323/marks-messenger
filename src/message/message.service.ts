import { InjectQueue } from '@nestjs/bullmq';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { Queue } from 'bullmq';
import { SendMessageDto } from './dto/send-message.dto';
import { PrismaService } from '../prisma/prisma.service';

export interface Message extends SendMessageDto {
    id: string,
    userId: number
}

@Injectable()
export class MessageService {
    constructor(
        @InjectQueue('messages')
        private readonly messageQueue: Queue<{ roomId: string, userId: number, text: string }>,
        private readonly prisma: PrismaService
    ) {}

    async processMessage(roomId: string, userId: number, text: string) {
        const userToRoom = await this.prisma.usersToRooms.findFirst({
            where: {
                roomId,
                userId
            }
        });

        if (!userToRoom) {
            throw new ForbiddenException('Вы не состоите в данной комнате');
        }

        try {
            const job = await this.messageQueue.add(
                'send-message',
                { roomId, userId, text },
                {
                    removeOnComplete: true,
                },
            );
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
}
