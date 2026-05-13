import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { BullModule } from '@nestjs/bullmq';
import { JobsModule } from './jobs/jobs.module';
import { RoomModule } from './room/room.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { EventsModule } from './events/events.module';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { MessageModule } from './message/message.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    BullModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        connection: {
          host: configService.get('REDIS_URL'),
          port: 6379
        }
      })
    }),
    EventEmitterModule.forRoot(),
    JobsModule,
    RoomModule,
    EventsModule,
    PrismaModule,
    UsersModule,
    AuthModule,
    MessageModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
