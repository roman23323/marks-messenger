import { Body, Controller, HttpCode, Post, Req, UseGuards } from '@nestjs/common';
import { SendMessageDto } from './dto/send-message.dto';
import { Message, MessageService } from './message.service';
import { AuthGuard } from '../auth/auth.guard';

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
    console.log('Пришло новое сообщение');
    const userId: number = request['user'].sub;
    await this.messageService.processMessage(sendMessageDto.roomId, userId, sendMessageDto.text);
    return {
      roomId: sendMessageDto.roomId,
      status: 'queued',
    };
  }
}
