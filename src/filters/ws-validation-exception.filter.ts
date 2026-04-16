import { Catch, ArgumentsHost } from '@nestjs/common';
import { BaseWsExceptionFilter, WsException } from '@nestjs/websockets';
import { ValidationError } from 'class-validator';
import { Socket } from 'socket.io-client';
import { SendMessageDto } from 'src/web-socket/dto/send-message.dto';

@Catch(WsException)
export class WsValidationExceptionFilter extends BaseWsExceptionFilter {
  catch(exception: WsException, host: ArgumentsHost) {
    const client = host.switchToWs().getClient<Socket>();
    const error = exception.getError();
    console.log(error);

    // Если ошибка валидации (массив ValidationError)
    if (Array.isArray(error) && error[0] instanceof ValidationError) {
      const errors = (error as ValidationError[]).reduce((acc, err) => {
        const field = err.property;
        const errors = Object.values(err.constraints || {});
        acc[field] = errors;
        return acc;
    }, {} as Record<string, string[]>);
      
      client.emit('message:ack', {
        status: 'error',
        code: 'VALIDATION_FAILED',
        errors,
        // TODO: Сделать более читаемо
        requestId: ((error as ValidationError[])[0].target as SendMessageDto).requestId
      });
    } else {
      // Другие ошибки
      client.emit('message:ack', {
        status: 'error',
        code: 'UNKNOWN_ERROR',
        message: typeof error === 'string' ? error : 'Internal server error',
      });
    }
  }
}