import {DocumentType, types} from '@typegoose/typegoose';
import {inject, injectable} from 'inversify';
import {isValidObjectId, Types} from 'mongoose';
import {City, Component} from '../../types/index.js';
import {Logger} from '../../libs/logger/index.js';
import {MongoEntityService} from '../../libs/entity-service/index.js';
import {CommentEntity} from '../comment/index.js';
import {CreateOfferDto} from './dto/create-offer.dto.js';
import {UpdateOfferDto} from './dto/update-offer.dto.js';
import {OfferService} from './offer-service.interface.js';
import {OfferEntity} from './offer.entity.js';
import {DEFAULT_OFFER_COUNT, PREMIUM_OFFER_COUNT, RATING_PRECISION} from './offer.constant.js';

type CommentStats = {
  rating: number;
  count: number;
};

@injectable()
export class DefaultOfferService extends MongoEntityService<OfferEntity> implements OfferService {
  constructor(
    @inject(Component.Logger) private readonly logger: Logger,
    @inject(Component.OfferModel) offerModel: types.ModelType<OfferEntity>,
    @inject(Component.CommentModel) private readonly commentModel: types.ModelType<CommentEntity>,
  ) {
    super(offerModel);
  }

  public async create(dto: CreateOfferDto): Promise<DocumentType<OfferEntity>> {
    const result = await this.model.create(dto);
    this.logger.info(`Создано предложение «${dto.title}»`);
    return result;
  }

  public async findById(offerId: string): Promise<DocumentType<OfferEntity> | null> {
    if (!isValidObjectId(offerId)) {
      return null;
    }
    return this.model.findById<DocumentType<OfferEntity>>(offerId).populate('authorId').exec();
  }

  public async find(count = DEFAULT_OFFER_COUNT): Promise<DocumentType<OfferEntity>[]> {
    return this.model
      .find<DocumentType<OfferEntity>>()
      .sort({postDate: -1})
      .limit(count)
      .populate('authorId')
      .exec();
  }

  public async findPremiumByCity(city: City): Promise<DocumentType<OfferEntity>[]> {
    return this.model
      .find<DocumentType<OfferEntity>>({city, isPremium: true})
      .sort({postDate: -1})
      .limit(PREMIUM_OFFER_COUNT)
      .populate('authorId')
      .exec();
  }

  public async updateById(offerId: string, dto: UpdateOfferDto): Promise<DocumentType<OfferEntity> | null> {
    if (!isValidObjectId(offerId)) {
      return null;
    }
    return this.model
      .findByIdAndUpdate<DocumentType<OfferEntity>>(offerId, dto, {new: true})
      .populate('authorId')
      .exec();
  }

  public async deleteById(offerId: string): Promise<DocumentType<OfferEntity> | null> {
    const offer = await super.deleteById(offerId);
    if (offer) {
      await this.commentModel.deleteMany({offerId}).exec();
      this.logger.info(`Удалено предложение ${offerId}`);
    }
    return offer;
  }

  public async isAuthor(offerId: string, userId: string): Promise<boolean> {
    if (!isValidObjectId(offerId) || !isValidObjectId(userId)) {
      return false;
    }
    return (await this.model.exists({_id: offerId, authorId: userId})) !== null;
  }

  public async updateCommentStats(offerId: string): Promise<DocumentType<OfferEntity> | null> {
    const [stats] = await this.commentModel
      .aggregate<CommentStats>([
        {$match: {offerId: new Types.ObjectId(offerId)}},
        {$group: {_id: '$offerId', rating: {$avg: '$rating'}, count: {$sum: 1}}},
      ])
      .exec();

    const update = stats
      ? {rating: Math.round(stats.rating * RATING_PRECISION) / RATING_PRECISION, commentsCount: stats.count}
      : {rating: 0, commentsCount: 0};

    return this.model.findByIdAndUpdate<DocumentType<OfferEntity>>(offerId, update, {new: true}).exec();
  }
}
