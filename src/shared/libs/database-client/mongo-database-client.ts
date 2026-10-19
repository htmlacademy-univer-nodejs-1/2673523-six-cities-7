import {setTimeout} from 'node:timers/promises';
import {inject, injectable} from 'inversify';
import mongoose from 'mongoose';
import {Component} from '../../types/index.js';
import {getErrorMessage} from '../../helpers/index.js';
import {Logger} from '../logger/index.js';
import {DatabaseClient} from './database-client.interface.js';

const RETRY_COUNT = 5;
const RETRY_DELAY_MS = 1000;
const CONNECT_TIMEOUT_MS = 5000;

@injectable()
export class MongoDatabaseClient implements DatabaseClient {
  private isConnected = false;

  constructor(@inject(Component.Logger) private readonly logger: Logger) {}

  public async connect(uri: string): Promise<void> {
    if (this.isConnected) {
      throw new Error('Подключение к БД уже установлено');
    }

    for (let attempt = 1; attempt <= RETRY_COUNT; attempt++) {
      this.logger.info(`Подключение к БД, попытка ${attempt} из ${RETRY_COUNT}`);
      try {
        await mongoose.connect(uri, {serverSelectionTimeoutMS: CONNECT_TIMEOUT_MS});
        this.isConnected = true;
        this.logger.info('Подключение установлено');
        return;
      } catch (error) {
        this.logger.warn(`Не удалось подключиться к БД: ${getErrorMessage(error)}`);
        await setTimeout(RETRY_DELAY_MS);
      }
    }

    throw new Error(`Не удалось подключиться к БД за ${RETRY_COUNT} попыток`);
  }

  public async disconnect(): Promise<void> {
    if (!this.isConnected) {
      return;
    }

    await mongoose.disconnect();
    this.isConnected = false;
    this.logger.info('Подключение к БД закрыто');
  }
}
