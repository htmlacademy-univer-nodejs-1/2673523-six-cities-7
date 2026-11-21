import {Request, Response} from 'express';
import {StatusCodes} from 'http-status-codes';
import {inject, injectable} from 'inversify';
import {City, Component} from '../../types/index.js';
import {CITIES} from '../../constants/index.js';
import {fillDto} from '../../helpers/index.js';
import {Logger} from '../../libs/logger/index.js';
import {
  BaseController,
  DocumentExistsMiddleware,
  HttpError,
  HttpMethod,
  ValidateDtoMiddleware,
  ValidateObjectIdMiddleware,
} from '../../libs/rest/index.js';
import {UserService} from '../user/user-service.interface.js';
import {OfferService} from './offer-service.interface.js';
import {OfferRdo} from './rdo/offer.rdo.js';
import {OfferPreviewRdo} from './rdo/offer-preview.rdo.js';
import {CreateOfferDto} from './dto/create-offer.dto.js';
import {UpdateOfferDto} from './dto/update-offer.dto.js';
import {CreateOfferRequest, OfferIdRequest, UpdateOfferRequest} from './offer-request.type.js';

@injectable()
export class OfferController extends BaseController {
  constructor(
    @inject(Component.Logger) logger: Logger,
    @inject(Component.OfferService) private readonly offerService: OfferService,
    @inject(Component.UserService) userService: UserService,
  ) {
    super(logger);

    const validateOfferId = new ValidateObjectIdMiddleware('offerId');
    const offerExists = new DocumentExistsMiddleware(this.offerService, 'Предложение', 'offerId');
    const offerMiddlewares = [validateOfferId, offerExists];

    this.addRoute({path: '/', method: HttpMethod.Get, handler: this.index});
    this.addRoute({
      path: '/',
      method: HttpMethod.Post,
      handler: this.create,
      middlewares: [
        new ValidateDtoMiddleware(CreateOfferDto),
        new DocumentExistsMiddleware(userService, 'Пользователь', 'authorId', 'body', StatusCodes.BAD_REQUEST),
      ],
    });
    this.addRoute({path: '/premium', method: HttpMethod.Get, handler: this.getPremium});
    this.addRoute({path: '/:offerId', method: HttpMethod.Get, handler: this.show, middlewares: offerMiddlewares});
    this.addRoute({
      path: '/:offerId',
      method: HttpMethod.Patch,
      handler: this.update,
      middlewares: [validateOfferId, new ValidateDtoMiddleware(UpdateOfferDto), offerExists],
    });
    this.addRoute({path: '/:offerId', method: HttpMethod.Delete, handler: this.delete, middlewares: offerMiddlewares});
  }

  private parseLimit(value: unknown): number | undefined {
    if (value === undefined) {
      return undefined;
    }
    const limit = Number(value);
    if (!Number.isInteger(limit) || limit < 1) {
      throw new HttpError(StatusCodes.BAD_REQUEST, 'limit должен быть целым числом > 0', 'OfferController');
    }
    return limit;
  }

  public async index(req: Request, res: Response): Promise<void> {
    const offers = await this.offerService.find(this.parseLimit(req.query.limit));
    this.ok(res, fillDto(OfferPreviewRdo, offers));
  }

  public async create({body}: CreateOfferRequest, res: Response): Promise<void> {
    const {id} = await this.offerService.create(body);
    const offer = await this.offerService.findById(id);
    this.created(res, fillDto(OfferRdo, offer));
  }

  public async getPremium(req: Request, res: Response): Promise<void> {
    const city = CITIES.find((item) => item === req.query.city);
    if (!city) {
      throw new HttpError(StatusCodes.BAD_REQUEST, `city должен быть одним из: ${CITIES.join(', ')}`, 'OfferController');
    }

    const offers = await this.offerService.findPremiumByCity(city as City);
    this.ok(res, fillDto(OfferPreviewRdo, offers));
  }

  public async show({params}: OfferIdRequest, res: Response): Promise<void> {
    const offer = await this.offerService.findById(params.offerId);
    this.ok(res, fillDto(OfferRdo, offer));
  }

  public async update({params, body}: UpdateOfferRequest, res: Response): Promise<void> {
    const offer = await this.offerService.updateById(params.offerId, body);
    this.ok(res, fillDto(OfferRdo, offer));
  }

  public async delete({params}: OfferIdRequest, res: Response): Promise<void> {
    await this.offerService.deleteById(params.offerId);
    this.noContent(res);
  }
}
