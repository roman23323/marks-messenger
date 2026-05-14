import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RedisService } from '../redis/redis.service';

@Injectable()
export class RoomService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly redisService: RedisService
    ) {}

    async createRoom(name: string) {
        const room = await this.prisma.room.create({
            data: {
                name
            }
        });
        return room.id;
    }

    async joinRoom(roomId: string, userId: number) {
        await this.prisma.usersToRooms.create({
            data: {
                userId,
                roomId
            }
        });
        this.redisService.addUserToRoom(roomId, userId);
    }

    async quitRoom(roomId: string, userId: number) {
        await this.prisma.usersToRooms.delete({
            where: {
                userId_roomId: {
                    userId,
                    roomId
                }
            }
        });
        this.redisService.removeUserFromRoom(roomId, userId);
    }

    async fetchHistory(
        userId: number,
        roomId: string,
        limit?: number,
        before?: string,
        after?: string
    ) {
        if (before && after) {
            throw new BadRequestException('Нельзя указывать after и before одновременно');
        }
        const userRoomRelation = this.prisma.usersToRooms.findFirst({
            where: {
                userId,
                roomId
            }
        });
        if (!userRoomRelation) {
            throw new UnauthorizedException('Пользователь не состоит в комнате');
        }

        const messages = await this.prisma.message.findMany({
            take: limit,
            where: {
                roomId,
                ...(before && {
                    id: {
                        lt: before
                    },
                }),
                ...(after && {
                    id: {
                        gt: after
                    }
                })
            },
            orderBy: {
                id: 'desc'
            }
        });

        return messages.reverse();
    }

    async getRoomList() {
        return await this.prisma.room.findMany();
    }
}
