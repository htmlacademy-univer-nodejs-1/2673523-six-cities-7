import {Response, Router} from 'express';
import asyncHandler from 'express-async-handler';
import {StatusCodes} from 'http-status-codes';
import {injectable, unmanaged} from 'inversify';
import {Logger} from '../../logger/index.js';
import {Route} from '../types/route.interface.js';
import {Controller} from './controller.interface.js';

@injectable()
export abstract class BaseController implements Controller {
  public readonly router: Router = Router();

  constructor(@unmanaged() protected readonly logger: Logger) {}

  public addRoute(route: Route): void {
    this.router[route.method](route.path, asyncHandler(route.handler.bind(this)));
    this.logger.info(`Зарегистрирован маршрут ${route.method.toUpperCase()} ${route.path}`);
  }

  public send<T>(res: Response, statusCode: number, data: T): void {
    res.type('application/json').status(statusCode).json(data);
  }

  public ok<T>(res: Response, data: T): void {
    this.send(res, StatusCodes.OK, data);
  }

  public created<T>(res: Response, data: T): void {
    this.send(res, StatusCodes.CREATED, data);
  }

  public noContent(res: Response): void {
    res.status(StatusCodes.NO_CONTENT).end();
  }
}
