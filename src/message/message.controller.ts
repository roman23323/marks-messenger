import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { SendMessageDto } from './dto/send-message.dto';
import { MessageService } from './message.service';

@Controller('message')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

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
