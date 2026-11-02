import {DocumentType} from '@typegoose/typegoose';
import {City} from '../../types/index.js';
import {EntityService} from '../../libs/entity-service/index.js';
import {CreateOfferDto} from './dto/create-offer.dto.js';
import {UpdateOfferDto} from './dto/update-offer.dto.js';
import {OfferEntity} from './offer.entity.js';

export interface OfferService extends EntityService<OfferEntity> {
  create(dto: CreateOfferDto): Promise<DocumentType<OfferEntity>>;
  find(count?: number): Promise<DocumentType<OfferEntity>[]>;
  findPremiumByCity(city: City): Promise<DocumentType<OfferEntity>[]>;
  updateById(offerId: string, dto: UpdateOfferDto): Promise<DocumentType<OfferEntity> | null>;
  isAuthor(offerId: string, userId: string): Promise<boolean>;
  updateCommentStats(offerId: string): Promise<DocumentType<OfferEntity> | null>;
}
