import {types} from '@typegoose/typegoose';
import {Container} from 'inversify';
import {Component} from '../../types/index.js';
import {DefaultOfferService} from './default-offer.service.js';
import {OfferService} from './offer-service.interface.js';
import {OfferEntity, OfferModel} from './offer.entity.js';

export function createOfferContainer(): Container {
  const container = new Container();
  container.bind<OfferService>(Component.OfferService).to(DefaultOfferService).inSingletonScope();
  container.bind<types.ModelType<OfferEntity>>(Component.OfferModel).toConstantValue(OfferModel);
  return container;
}
