import {Response} from 'express';
import {StatusCodes} from 'http-status-codes';
import {inject, injectable} from 'inversify';
import {Component} from '../../types/index.js';
import {fillDto} from '../../helpers/index.js';
import {Logger} from '../../libs/logger/index.js';
import {
  BaseController,
  DocumentExistsMiddleware,
  HttpMethod,
  ValidateDtoMiddleware,
  ValidateObjectIdMiddleware,
} from '../../libs/rest/index.js';
import {OfferService} from '../offer/offer-service.interface.js';
import {UserService} from '../user/user-service.interface.js';
import {CommentService} from './comment-service.interface.js';
import {CreateCommentDto} from './dto/create-comment.dto.js';
import {CommentRdo} from './rdo/comment.rdo.js';
import {CommentsByOfferRequest, CreateCommentRequest} from './comment-request.type.js';

@injectable()
export class CommentController extends BaseController {
  constructor(
    @inject(Component.Logger) logger: Logger,
    @inject(Component.CommentService) private readonly commentService: CommentService,
    @inject(Component.OfferService) offerService: OfferService,
    @inject(Component.UserService) userService: UserService,
  ) {
    super(logger);

    const validateOfferId = new ValidateObjectIdMiddleware('offerId');
    const offerExists = new DocumentExistsMiddleware(offerService, 'Предложение', 'offerId');

    this.addRoute({
      path: '/:offerId/comments',
      method: HttpMethod.Get,
      handler: this.index,
      middlewares: [validateOfferId, offerExists],
    });
    this.addRoute({
      path: '/:offerId/comments',
      method: HttpMethod.Post,
      handler: this.create,
      middlewares: [
        validateOfferId,
        new ValidateDtoMiddleware(CreateCommentDto),
        offerExists,
        new DocumentExistsMiddleware(userService, 'Пользователь', 'authorId', 'body', StatusCodes.BAD_REQUEST),
      ],
    });
  }

  public async index({params}: CommentsByOfferRequest, res: Response): Promise<void> {
    const comments = await this.commentService.findByOfferId(params.offerId);
    this.ok(res, fillDto(CommentRdo, comments));
  }

  public async create({params, body}: CreateCommentRequest, res: Response): Promise<void> {
    const comment = await this.commentService.create({...body, offerId: params.offerId});
    this.created(res, fillDto(CommentRdo, comment));
  }
}
