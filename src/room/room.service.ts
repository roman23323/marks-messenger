import { PrismaService } from '../prisma/prisma.service';

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
