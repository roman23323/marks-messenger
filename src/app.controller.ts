import { Body, Controller, Get, HttpCode, Post, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { SendMessageDto } from './message/dto/send-message.dto';
import { MessageService } from './message/message.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
