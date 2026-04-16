import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { WebSocketModule } from './web-socket/web-socket.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      validate: (env) => ({
        GIGACHAT_AUTH_KEY: env.GIGACHAT_AUTH_KEY
      })
    }),
    WebSocketModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
