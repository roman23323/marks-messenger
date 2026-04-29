import { Body, Controller, Get, HttpCode, Post, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { SendMessageDto } from './room/dto/send-message.dto';
import { MessageService } from './room/message/message.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly messageService: MessageService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('send-message')
  @HttpCode(202)
  async sendMessage(
    @Body() message: SendMessageDto,
  ) {
    console.log('Поступило сообщение!');
    const jobData = await this.messageService.processMessage(message);
    return {
      requestId: message.requestId,
      roomId: message.roomId,
      status: 'queued',
    };
  }
}
