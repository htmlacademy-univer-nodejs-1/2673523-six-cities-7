import 'reflect-metadata';
import {Container} from 'inversify';
import {Component} from './shared/types/index.js';
import {Logger, PinoLogger} from './shared/libs/logger/index.js';
import {Config, RestConfig, RestSchema} from './shared/libs/config/index.js';
import {RestApplication} from './rest/index.js';

function createContainer(): Container {
  const container = new Container();
  container.bind<Logger>(Component.Logger).to(PinoLogger).inSingletonScope();
  container.bind<Config<RestSchema>>(Component.Config).to(RestConfig).inSingletonScope();
  container.bind<RestApplication>(Component.RestApplication).to(RestApplication).inSingletonScope();
  return container;
}

async function bootstrap(): Promise<void> {
  const container = createContainer();
  const logger = container.get<Logger>(Component.Logger);

  try {
    const application = container.get<RestApplication>(Component.RestApplication);
    await application.init();
  } catch (error) {
    logger.error('Не удалось запустить приложение', error instanceof Error ? error : new Error(String(error)));
    process.exitCode = 1;
  }
}

bootstrap();
