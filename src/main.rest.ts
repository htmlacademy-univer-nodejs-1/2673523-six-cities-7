import 'reflect-metadata';
import {Container} from 'inversify';
import {Component} from './shared/types/index.js';
import {Logger} from './shared/libs/logger/index.js';
import {createRestContainer, RestApplication} from './rest/index.js';
import {createUserContainer} from './shared/modules/user/index.js';
import {createOfferContainer} from './shared/modules/offer/index.js';

async function bootstrap(): Promise<void> {
  const container = Container.merge(
    createRestContainer(),
    createUserContainer(),
    createOfferContainer(),
  );
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
