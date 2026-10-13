import {config} from 'dotenv';
import {inject, injectable} from 'inversify';
import {Component} from '../../types/index.js';
import {Logger} from '../logger/index.js';
import {Config} from './config.interface.js';
import {restSchema, RestSchema} from './rest-schema.js';

@injectable()
export class RestConfig implements Config<RestSchema> {
  private readonly config: RestSchema;

  constructor(@inject(Component.Logger) private readonly logger: Logger) {
    const {error} = config();
    if (error) {
      throw new Error('Не удалось прочитать файл .env');
    }

    restSchema.load({});
    restSchema.validate({allowed: 'strict'});

    const missing = Object.entries(restSchema.getProperties())
      .filter(([, value]) => value === null || value === '')
      .map(([key]) => key);
    if (missing.length > 0) {
      throw new Error(`Не заданы обязательные параметры: ${missing.join(', ')}`);
    }

    this.config = restSchema.getProperties();
    this.logger.info('Конфиг загружена');
  }

  public get<K extends keyof RestSchema>(key: K): RestSchema[K] {
    return this.config[key];
  }
}
