import {rm} from 'node:fs/promises';
import {Request, Response} from 'express';
import {StatusCodes} from 'http-status-codes';
import {inject, injectable} from 'inversify';
import jwt from 'jsonwebtoken';
import {Component} from '../../types/index.js';
import {UPLOAD_URL_PATH} from '../../constants/index.js';
import {createSha256, fillDto} from '../../helpers/index.js';
import {Logger} from '../../libs/logger/index.js';
import {Config, RestSchema} from '../../libs/config/index.js';
import {AuthenticateMiddleware, BaseController, HttpError, HttpMethod, ValidateDtoMiddleware} from '../../libs/rest/index.js';
import {UserService} from './user-service.interface.js';
import {UserRdo} from './rdo/user.rdo.js';
import {CreateUserDto} from './dto/create-user.dto.js';
import {LoginUserDto} from './dto/login-user.dto.js';
import {CreateUserRequest, LoginUserRequest} from './user-request.type.js';
import {UploadAvatarMiddleware} from './upload-avatar.middleware.js';

@injectable()
export class UserController extends BaseController {
  constructor(
    @inject(Component.Logger) logger: Logger,
    @inject(Component.UserService) private readonly userService: UserService,
    @inject(Component.Config) private readonly config: Config<RestSchema>,
  ) {
    super(logger);

    this.addRoute({
      path: '/register',
      method: HttpMethod.Post,
      handler: this.create,
      middlewares: [new ValidateDtoMiddleware(CreateUserDto)],
    });
    this.addRoute({
      path: '/login',
      method: HttpMethod.Post,
      handler: this.login,
      middlewares: [new ValidateDtoMiddleware(LoginUserDto)],
    });
    this.addRoute({path: '/login', method: HttpMethod.Get, handler: this.checkAuth});
    this.addRoute({
      path: '/avatar',
      method: HttpMethod.Post,
      handler: this.uploadAvatar,
      middlewares: [
        new AuthenticateMiddleware(this.config.get('JWT_SECRET')),
        new UploadAvatarMiddleware(this.config.get('UPLOAD_DIRECTORY')),
      ],
    });
  }

  public async create({body}: CreateUserRequest, res: Response): Promise<void> {
    const existingUser = await this.userService.findByEmail(body.email);
    if (existingUser) {
      throw new HttpError(StatusCodes.CONFLICT, `Пользователь с email ${body.email} уже существует`, 'UserController');
    }

    const user = await this.userService.create(body, this.config.get('SALT'));
    this.created(res, fillDto(UserRdo, user));
  }

  public async login({body}: LoginUserRequest, res: Response): Promise<void> {
    const user = await this.userService.findByEmail(body.email);
    if (!user || user.getPassword() !== createSha256(body.password, this.config.get('SALT'))) {
      throw new HttpError(StatusCodes.UNAUTHORIZED, 'Неверный email или пароль', 'UserController');
    }

    const token = jwt.sign({}, this.config.get('JWT_SECRET'), {
      algorithm: 'HS256',
      subject: user.id,
      expiresIn: '1h',
    });
    this.ok(res, {token, user: fillDto(UserRdo, user)});
  }

  public async checkAuth(_req: Request, _res: Response): Promise<void> {
    throw new HttpError(StatusCodes.NOT_IMPLEMENTED, 'WIP', 'UserController');
  }

  public async uploadAvatar({file}: Request, res: Response): Promise<void> {
    if (!file) {
      throw new HttpError(StatusCodes.BAD_REQUEST, 'Отправьте один файл в поле avatar');
    }

    const avatarUrl = `${UPLOAD_URL_PATH}/${file.filename}`;
    const userId: string = res.locals.userId;
    try {
      const user = await this.userService.updateById(userId, {avatarUrl});
      if (!user) {
        throw new HttpError(StatusCodes.UNAUTHORIZED, 'Пользователь не найден');
      }
    } catch (error) {
      await rm(file.path, {force: true}).catch(() => this.logger.warn('Не удалось удалить файл аватара'));
      throw error;
    }

    this.created(res, {avatarUrl});
  }
}
