import {inject, injectable} from 'inversify';
import {Component} from '../shared/types/index.js';
import {Logger} from '../shared/libs/logger/index.js';
import {Config, RestSchema} from '../shared/libs/config/index.js';
import {DatabaseClient} from '../shared/libs/database-client/index.js';
import {getMongoUri} from '../shared/helpers/index.js';

@injectable()
export class RestApplication {
  constructor(
    @inject(Component.Logger) private readonly logger: Logger,
    @inject(Component.Config) private readonly config: Config<RestSchema>,
    @inject(Component.DatabaseClient) private readonly databaseClient: DatabaseClient,
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

  public async init(): Promise<void> {
    this.logger.info('Приложение инициализировано');
    this.logger.info(`Порт: ${this.config.get('PORT')}`);
    await this.initDatabase();
    this.logger.info('База данных инициализирована');
  }
}
