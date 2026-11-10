import {Expose, Type} from 'class-transformer';
import {Amenity} from '../../../types/index.js';
import {UserRdo} from '../../user/rdo/user.rdo.js';
import {LocationRdo} from './location.rdo.js';
import {OfferPreviewRdo} from './offer-preview.rdo.js';

export class OfferRdo extends OfferPreviewRdo {
  @Expose()
  public description!: string;

  @Expose()
  public photos!: string[];

  @Expose()
  public roomsCount!: number;

  @Expose()
  public guestsCount!: number;

  @Expose()
  public amenities!: Amenity[];

  @Expose({name: 'authorId'})
  @Type(() => UserRdo)
  public author!: UserRdo;

  @Expose()
  @Type(() => LocationRdo)
  public location!: LocationRdo;
}
