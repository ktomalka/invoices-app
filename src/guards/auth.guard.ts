import {
  NestMiddleware,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class AuthGuard implements NestMiddleware {
  async use(req: Request, _, next: () => void) {
    const { headers } = req;
    if (!headers.authorization) {
      throw new UnauthorizedException('The Authorization header not found');
    }

    const token = headers.authorization.replace('Bearer ', '');
    if (token !== process.env.TOKEN) {
      throw new UnauthorizedException('The Authorization header is incorrect');
    }

    next();
  }
}
