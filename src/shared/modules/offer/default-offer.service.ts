import {DocumentType, types} from '@typegoose/typegoose';
import {inject, injectable} from 'inversify';
import {Component} from '../../types/index.js';
import {Logger} from '../../libs/logger/index.js';
import {MongoEntityService} from '../../libs/entity-service/index.js';
import {CreateOfferDto} from './dto/create-offer.dto.js';
import {OfferService} from './offer-service.interface.js';
import {OfferEntity} from './offer.entity.js';

@injectable()
export class DefaultOfferService extends MongoEntityService<OfferEntity> implements OfferService {
  constructor(
    @inject(Component.Logger) private readonly logger: Logger,
    @inject(Component.OfferModel) offerModel: types.ModelType<OfferEntity>,
  ) {
    super(offerModel);
  }

  public async create(dto: CreateOfferDto): Promise<DocumentType<OfferEntity>> {
    const result = await this.model.create(dto);
    this.logger.info(`Создано предложение «${dto.title}»`);
    return result;
  }
}
