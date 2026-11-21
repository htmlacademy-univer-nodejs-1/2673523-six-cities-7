import {NextFunction, Request, Response} from 'express';
import {StatusCodes} from 'http-status-codes';
import {DocumentExists} from '../../entity-service/index.js';
import {HttpError} from '../errors/http-error.js';
import {Middleware} from './middleware.interface.js';

export class DocumentExistsMiddleware implements Middleware {
  constructor(
    private readonly service: DocumentExists,
    private readonly entityName: string,
    private readonly field: string,
    private readonly source: 'params' | 'body' = 'params',
    private readonly notFoundStatus: StatusCodes = StatusCodes.NOT_FOUND,
  ) {}

  public async execute(req: Request, _res: Response, next: NextFunction): Promise<void> {
    const id: unknown = req[this.source]?.[this.field];
    if (typeof id !== 'string' || id.length === 0) {
      throw new HttpError(StatusCodes.BAD_REQUEST, `Некорректный идентификатор в поле ${this.field}`, 'DocumentExistsMiddleware');
    }

    if (!(await this.service.exists(id))) {
      throw new HttpError(
        this.notFoundStatus,
        `Не удалось найти документ «${this.entityName}» с идентификатором ${id}`,
        'DocumentExistsMiddleware',
      );
    }
    next();
  }
}
