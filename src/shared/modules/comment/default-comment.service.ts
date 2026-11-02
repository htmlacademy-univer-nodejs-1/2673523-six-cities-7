import {DocumentType, types} from '@typegoose/typegoose';
import {inject, injectable} from 'inversify';
import {Component} from '../../types/index.js';
import {Logger} from '../../libs/logger/index.js';
import {MongoEntityService} from '../../libs/entity-service/index.js';
import {OfferService} from '../offer/index.js';
import {CreateCommentDto} from './dto/create-comment.dto.js';
import {CommentService} from './comment-service.interface.js';
import {CommentEntity} from './comment.entity.js';
import {DEFAULT_COMMENT_COUNT} from './comment.constant.js';

@injectable()
export class DefaultCommentService extends MongoEntityService<CommentEntity> implements CommentService {
  constructor(
    @inject(Component.Logger) private readonly logger: Logger,
    @inject(Component.CommentModel) commentModel: types.ModelType<CommentEntity>,
    @inject(Component.OfferService) private readonly offerService: OfferService,
  ) {
    super(commentModel);
  }

  public async create(dto: CreateCommentDto): Promise<DocumentType<CommentEntity>> {
    const comment = await this.model.create(dto);
    await this.offerService.updateCommentStats(dto.offerId);
    this.logger.info(`Добавлен комментарий к офферу ${dto.offerId}`);
    return comment.populate('authorId');
  }

  public async findByOfferId(offerId: string): Promise<DocumentType<CommentEntity>[]> {
    return this.model
      .find<DocumentType<CommentEntity>>({offerId})
      .sort({createdAt: -1})
      .limit(DEFAULT_COMMENT_COUNT)
      .populate('authorId')
      .exec();
  }

  public async deleteByOfferId(offerId: string): Promise<number> {
    const {deletedCount} = await this.model.deleteMany({offerId}).exec();
    return deletedCount;
  }
}
