import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class RoomService {
    constructor(private readonly prisma: PrismaService) {}

    async createRoom(name: string) {
        const room = await this.prisma.room.create({
            data: {
                name
            }
        });
        return room.id;
    }
}
