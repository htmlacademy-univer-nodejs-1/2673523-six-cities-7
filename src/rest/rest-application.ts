import express, {Express} from 'express';
import {inject, injectable} from 'inversify';
import {Component} from '../shared/types/index.js';
import {Logger} from '../shared/libs/logger/index.js';
import {Config, RestSchema} from '../shared/libs/config/index.js';
import {DatabaseClient} from '../shared/libs/database-client/index.js';
import {Controller, ExceptionFilter} from '../shared/libs/rest/index.js';
import {getMongoUri} from '../shared/helpers/index.js';

@injectable()
export class RestApplication {
  private readonly server: Express = express();

  constructor(
    @inject(Component.Logger) private readonly logger: Logger,
    @inject(Component.Config) private readonly config: Config<RestSchema>,
    @inject(Component.DatabaseClient) private readonly databaseClient: DatabaseClient,
    @inject(Component.ExceptionFilter) private readonly exceptionFilter: ExceptionFilter,
    @inject(Component.UserController) private readonly userController: Controller,
    @inject(Component.OfferController) private readonly offerController: Controller,
    @inject(Component.FavoriteController) private readonly favoriteController: Controller,
  ) {}

  private async initDatabase(): Promise<void> {
    const uri = getMongoUri(
      this.config.get('DB_USER'),
      this.config.get('DB_PASSWORD'),
      this.config.get('DB_HOST'),
      String(this.config.get('DB_PORT')),
      this.config.get('DB_NAME'),
    );
    await this.databaseClient.connect(uri);
  }

  private initMiddleware(): void {
    this.server.use(express.json());
  }

  private initControllers(): void {
    this.server.use('/users', this.userController.router);
    this.server.use('/offers', this.offerController.router);
    this.server.use('/favorites', this.favoriteController.router);
  }

  private initExceptionFilters(): void {
    this.server.use(this.exceptionFilter.catch.bind(this.exceptionFilter));
  }

  private initServer(): Promise<void> {
    const port = this.config.get('PORT');
    return new Promise((resolve) => {
      this.server.listen(port, () => resolve());
    });
  }

  public async init(): Promise<void> {
    this.logger.info('Инициализация приложения');

    await this.initDatabase();
    this.logger.info('База данных инициализирована');

    this.initMiddleware();
    this.initControllers();
    this.initExceptionFilters();

    await this.initServer();
    this.logger.info(`Сервер запущен на http://localhost:${this.config.get('PORT')}`);
  }
}
