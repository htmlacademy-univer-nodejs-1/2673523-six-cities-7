import {Request, Response} from 'express';
import {StatusCodes} from 'http-status-codes';
import {inject, injectable} from 'inversify';
import {Component} from '../../types/index.js';
import {fillDto} from '../../helpers/index.js';
import {Logger} from '../../libs/logger/index.js';
import {Config, RestSchema} from '../../libs/config/index.js';
import {BaseController, HttpError, HttpMethod} from '../../libs/rest/index.js';
import {UserService} from './user-service.interface.js';
import {UserRdo} from './rdo/user.rdo.js';
import {CreateUserRequest, LoginUserRequest} from './user-request.type.js';

@injectable()
export class UserController extends BaseController {
  constructor(
    @inject(Component.Logger) logger: Logger,
    @inject(Component.UserService) private readonly userService: UserService,
    @inject(Component.Config) private readonly config: Config<RestSchema>,
  ) {
    super(logger);

    this.addRoute({path: '/register', method: HttpMethod.Post, handler: this.create});
    this.addRoute({path: '/login', method: HttpMethod.Post, handler: this.login});
    this.addRoute({path: '/login', method: HttpMethod.Get, handler: this.checkAuth});
    this.addRoute({path: '/avatar', method: HttpMethod.Post, handler: this.uploadAvatar});
  }

  public async create({body}: CreateUserRequest, res: Response): Promise<void> {
    const existingUser = await this.userService.findByEmail(body.email);
    if (existingUser) {
      throw new HttpError(StatusCodes.CONFLICT, `Пользователь с email ${body.email} уже существует`, 'UserController');
    }

    const user = await this.userService.create(body, this.config.get('SALT'));
    this.created(res, fillDto(UserRdo, user));
  }

  public async login({body}: LoginUserRequest, _res: Response): Promise<void> {
    const user = await this.userService.findByEmail(body.email);
    if (!user) {
      throw new HttpError(StatusCodes.UNAUTHORIZED, 'Неверный email или пароль', 'UserController');
    }

    throw new HttpError(StatusCodes.NOT_IMPLEMENTED, 'WIP', 'UserController');
  }

  public async checkAuth(_req: Request, _res: Response): Promise<void> {
    throw new HttpError(StatusCodes.NOT_IMPLEMENTED, 'WIP', 'UserController');
  }

  public async uploadAvatar(_req: Request, _res: Response): Promise<void> {
    throw new HttpError(StatusCodes.NOT_IMPLEMENTED, 'WIP', 'UserController');
  }
}
