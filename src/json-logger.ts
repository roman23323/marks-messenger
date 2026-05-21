import { LoggerService, Injectable } from '@nestjs/common';
import { requestStorage } from 'src/request-store';

@Injectable()
export class JsonLogger implements LoggerService {
  private readonly serviceName = 'auth-service';

  private formatMessage(level: 'info' | 'error' | 'warn', message: any, context?: string, metadata: Record<string, any> = {}) {
    const store = requestStorage.getStore();
    const requestId = store?.get('requestId');

    return JSON.stringify({
      time: new Date().toISOString(),
      level,
      service: this.serviceName,
      context: context || 'App',
      requestId: requestId || undefined,
      msg: typeof message === 'string' ? message : JSON.stringify(message),
      ...metadata,
    });
  }

  log(message: any, context?: string) {
    console.log(this.formatMessage('info', message, context));
  }

  error(message: any, trace?: string, context?: string) {
    console.error(this.formatMessage('error', message, context, { trace }));
  }

  warn(message: any, context?: string) {
    console.warn(this.formatMessage('warn', message, context));
  }
}
