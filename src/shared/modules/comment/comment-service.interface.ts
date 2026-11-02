import {DocumentType} from '@typegoose/typegoose';
import {EntityService} from '../../libs/entity-service/index.js';
import {CreateCommentDto} from './dto/create-comment.dto.js';
import {CommentEntity} from './comment.entity.js';

export interface CommentService extends EntityService<CommentEntity> {
  create(dto: CreateCommentDto): Promise<DocumentType<CommentEntity>>;
  findByOfferId(offerId: string): Promise<DocumentType<CommentEntity>[]>;
  deleteByOfferId(offerId: string): Promise<number>;
}
