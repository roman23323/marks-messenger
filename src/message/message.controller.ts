import { Body, Controller, HttpCode, Post, Req, UseGuards } from '@nestjs/common';
import { SendMessageDto } from './dto/send-message.dto';
import { MessageService } from './message.service';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('message')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @UseGuards(AuthGuard)
  @Post('send-message')
  @HttpCode(202)
  async sendMessage(
    @Body() sendMessageDto: SendMessageDto,
    @Req() request
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
