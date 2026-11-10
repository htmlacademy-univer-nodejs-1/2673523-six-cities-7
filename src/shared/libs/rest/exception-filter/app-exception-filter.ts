import {NextFunction, Request, Response} from 'express';
import {StatusCodes} from 'http-status-codes';
import {inject, injectable} from 'inversify';
import {Component} from '../../../types/index.js';
import {createErrorObject} from '../../../helpers/index.js';
import {Logger} from '../../logger/index.js';
import {HttpError} from '../errors/http-error.js';
import {ExceptionFilter} from './exception-filter.interface.js';

function isBodyParseError(error: Error): boolean {
  return error instanceof SyntaxError && 'type' in error && error.type === 'entity.parse.failed';
}

@injectable()
export class AppExceptionFilter implements ExceptionFilter {
  constructor(@inject(Component.Logger) private readonly logger: Logger) {}

  private handleHttpError(error: HttpError, req: Request, res: Response): void {
    this.logger.warn(`${req.method} ${req.originalUrl} → ${error.httpStatusCode}: ${error.message}${error.detail ? ` [${error.detail}]` : ''}`);
    res.status(error.httpStatusCode).json(createErrorObject(error.message));
  }

  private handleServerError(error: Error, req: Request, res: Response): void {
    this.logger.error(`${req.method} ${req.originalUrl} → 500`, error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(createErrorObject('Внутренняя ошибка сервера'));
  }

  public catch(error: Error, req: Request, res: Response, _next: NextFunction): void {
    if (error instanceof HttpError) {
      return this.handleHttpError(error, req, res);
    }
    if (isBodyParseError(error)) {
      return this.handleHttpError(new HttpError(StatusCodes.BAD_REQUEST, 'Некорректный JSON в теле запроса'), req, res);
    }
    this.handleServerError(error, req, res);
  }
}
