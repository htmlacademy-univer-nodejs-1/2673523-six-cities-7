import {Request, Response} from 'express';
import {StatusCodes} from 'http-status-codes';
import {inject, injectable} from 'inversify';
import {Component} from '../../types/index.js';
import {Logger} from '../../libs/logger/index.js';
import {BaseController, HttpError, HttpMethod} from '../../libs/rest/index.js';

const NOT_IMPLEMENTED_MESSAGE = 'Избранное будет доступно после реализации авторизации';

@injectable()
export class FavoriteController extends BaseController {
  constructor(@inject(Component.Logger) logger: Logger) {
    super(logger);

    this.addRoute({path: '/', method: HttpMethod.Get, handler: this.index});
    this.addRoute({path: '/:offerId', method: HttpMethod.Put, handler: this.add});
    this.addRoute({path: '/:offerId', method: HttpMethod.Delete, handler: this.remove});
  }

  public async index(_req: Request, _res: Response): Promise<void> {
    throw new HttpError(StatusCodes.NOT_IMPLEMENTED, NOT_IMPLEMENTED_MESSAGE, 'FavoriteController');
  }

  public async add(_req: Request, _res: Response): Promise<void> {
    throw new HttpError(StatusCodes.NOT_IMPLEMENTED, NOT_IMPLEMENTED_MESSAGE, 'FavoriteController');
  }

  public async remove(_req: Request, _res: Response): Promise<void> {
    throw new HttpError(StatusCodes.NOT_IMPLEMENTED, NOT_IMPLEMENTED_MESSAGE, 'FavoriteController');
  }
}
