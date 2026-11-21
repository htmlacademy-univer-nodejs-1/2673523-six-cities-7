import {NextFunction, Request, Response} from 'express';
import {StatusCodes} from 'http-status-codes';
import jwt from 'jsonwebtoken';
import {isObjectIdOrHexString} from 'mongoose';
import {HttpError} from '../errors/http-error.js';
import {Middleware} from './middleware.interface.js';

export class AuthenticateMiddleware implements Middleware {
  constructor(private readonly secret: string) {}

  public execute(req: Request, res: Response, next: NextFunction): void {
    const token = req.get('authorization')?.match(/^Bearer +(\S+)$/i)?.[1];
    if (!token) {
      throw new HttpError(StatusCodes.UNAUTHORIZED, 'Требуется токен авторизации');
    }

    let payload: jwt.JwtPayload | string;
    try {
      payload = jwt.verify(token, this.secret, {algorithms: ['HS256']});
    } catch {
      throw new HttpError(StatusCodes.UNAUTHORIZED, 'Недействительный токен авторизации');
    }

    if (typeof payload === 'string' || !isObjectIdOrHexString(payload?.sub)) {
      throw new HttpError(StatusCodes.UNAUTHORIZED, 'Недействительный токен авторизации');
    }

    res.locals.userId = payload.sub;
    next();
  }
}
