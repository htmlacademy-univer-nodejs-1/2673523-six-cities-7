import {types} from '@typegoose/typegoose';
import {Container} from 'inversify';
import {Component} from '../../types/index.js';
import {CommentService} from './comment-service.interface.js';
import {DefaultCommentService} from './default-comment.service.js';
import {CommentEntity, CommentModel} from './comment.entity.js';

export function createCommentContainer(): Container {
  const container = new Container();
  container.bind<CommentService>(Component.CommentService).to(DefaultCommentService).inSingletonScope();
  container.bind<types.ModelType<CommentEntity>>(Component.CommentModel).toConstantValue(CommentModel);
  return container;
}
