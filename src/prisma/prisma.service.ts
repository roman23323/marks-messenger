import { Injectable, Logger, OnApplicationShutdown } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

@Injectable()
export class PrismaService extends PrismaClient implements OnApplicationShutdown {
    private readonly logger = new Logger(PrismaService.name);

    constructor(config: ConfigService) {
        const adapter = new PrismaPg({ connectionString: config.get<string>('DATABASE_URL') })
        super({ adapter });
    }

    async onApplicationShutdown(signal?: string) {
        this.logger.log(`Получен сигнал: ${signal}. Закрытие соединения Prisma с СУБД...`);
        await this.$disconnect();
        this.logger.log('Соединение Prisma закрыто успешно.');
    }
}
