import {DocumentType} from '@typegoose/typegoose';
import {EntityService} from '../../libs/entity-service/index.js';
import {CreateOfferDto} from './dto/create-offer.dto.js';
import {OfferEntity} from './offer.entity.js';

export interface OfferService extends EntityService<OfferEntity> {
  create(dto: CreateOfferDto): Promise<DocumentType<OfferEntity>>;
}
