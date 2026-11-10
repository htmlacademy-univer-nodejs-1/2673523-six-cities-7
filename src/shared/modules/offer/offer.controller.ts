import {Request, Response} from 'express';
import {StatusCodes} from 'http-status-codes';
import {inject, injectable} from 'inversify';
import {City, Component} from '../../types/index.js';
import {CITIES} from '../../constants/index.js';
import {fillDto} from '../../helpers/index.js';
import {Logger} from '../../libs/logger/index.js';
import {BaseController, HttpError, HttpMethod} from '../../libs/rest/index.js';
import {UserService} from '../user/user-service.interface.js';
import {OfferService} from './offer-service.interface.js';
import {OfferRdo} from './rdo/offer.rdo.js';
import {OfferPreviewRdo} from './rdo/offer-preview.rdo.js';
import {CreateOfferRequest, OfferIdRequest, UpdateOfferRequest} from './offer-request.type.js';

@injectable()
export class OfferController extends BaseController {
  constructor(
    @inject(Component.Logger) logger: Logger,
    @inject(Component.OfferService) private readonly offerService: OfferService,
    @inject(Component.UserService) private readonly userService: UserService,
  ) {
    super(logger);

    this.addRoute({path: '/', method: HttpMethod.Get, handler: this.index});
    this.addRoute({path: '/', method: HttpMethod.Post, handler: this.create});
    this.addRoute({path: '/premium', method: HttpMethod.Get, handler: this.getPremium});
    this.addRoute({path: '/:offerId', method: HttpMethod.Get, handler: this.show});
    this.addRoute({path: '/:offerId', method: HttpMethod.Patch, handler: this.update});
    this.addRoute({path: '/:offerId', method: HttpMethod.Delete, handler: this.delete});
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
    if (!(await this.userService.exists(body.authorId))) {
      throw new HttpError(StatusCodes.BAD_REQUEST, `пользователь ${body.authorId} не найден`, 'OfferController');
    }

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
    if (!offer) {
      throw new HttpError(StatusCodes.NOT_FOUND, `предложение ${params.offerId} не найдено`, 'OfferController');
    }
    this.ok(res, fillDto(OfferRdo, offer));
  }

  public async update({params, body}: UpdateOfferRequest, res: Response): Promise<void> {
    const offer = await this.offerService.updateById(params.offerId, body);
    if (!offer) {
      throw new HttpError(StatusCodes.NOT_FOUND, `предложение ${params.offerId} не найдено`, 'OfferController');
    }
    this.ok(res, fillDto(OfferRdo, offer));
  }

  public async delete({params}: OfferIdRequest, res: Response): Promise<void> {
    const offer = await this.offerService.deleteById(params.offerId);
    if (!offer) {
      throw new HttpError(StatusCodes.NOT_FOUND, `предложение ${params.offerId} не найдено`, 'OfferController');
    }
    this.noContent(res);
  }
}
