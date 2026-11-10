import {Request} from 'express';
import {ParamOfferId, RequestBody, RequestParams} from '../../libs/rest/index.js';
import {CreateOfferDto} from './dto/create-offer.dto.js';
import {UpdateOfferDto} from './dto/update-offer.dto.js';

export type CreateOfferRequest = Request<RequestParams, RequestBody, CreateOfferDto>;
export type UpdateOfferRequest = Request<ParamOfferId, RequestBody, UpdateOfferDto>;
export type OfferIdRequest = Request<ParamOfferId>;
