import {ParamsDictionary} from 'express-serve-static-core';

export type RequestBody = Record<string, unknown>;
export type RequestParams = Record<string, unknown>;
export type ParamOfferId = {offerId: string} | ParamsDictionary;
