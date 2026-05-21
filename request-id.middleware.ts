import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { requestStorage } from './request-store';

@Injectable()
export class RequestIdMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const requestId = (req.headers['x-request-id'] as string) || uuidv4();

    res.setHeader('X-Request-ID', requestId);

    const store = new Map<string, string>();
    store.set('requestId', requestId);

    requestStorage.run(store, () => {
      next();
    });
  }
}
