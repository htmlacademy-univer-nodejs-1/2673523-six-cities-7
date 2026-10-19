import {defaultClasses, getModelForClass, modelOptions, prop, Ref} from '@typegoose/typegoose';
import {Amenity, City, HousingType} from '../../types/index.js';
import {AMENITIES, CITIES, HOUSING_TYPES} from '../../constants/index.js';
import {UserEntity} from '../user/index.js';

export class LocationEntity {
  @prop({required: true})
  public latitude!: number;

  @prop({required: true})
  public longitude!: number;
}

@modelOptions({schemaOptions: {collection: 'offers', timestamps: true}})
export class OfferEntity extends defaultClasses.TimeStamps {
  @prop({required: true, trim: true})
  public title!: string;

  @prop({required: true, trim: true})
  public description!: string;

  @prop({required: true})
  public postDate!: Date;

  @prop({required: true, type: () => String, enum: CITIES})
  public city!: City;

  @prop({required: true})
  public previewImage!: string;

  @prop({required: true, type: () => [String]})
  public photos!: string[];

  @prop({default: false})
  public isPremium!: boolean;

  @prop({default: false})
  public isFavorite!: boolean;

  @prop({required: true})
  public rating!: number;

  @prop({required: true, type: () => String, enum: HOUSING_TYPES})
  public type!: HousingType;

  @prop({required: true})
  public roomsCount!: number;

  @prop({required: true})
  public guestsCount!: number;

  @prop({required: true})
  public price!: number;

  @prop({required: true, type: () => [String], enum: AMENITIES})
  public amenities!: Amenity[];

  @prop({required: true, ref: () => UserEntity})
  public authorId!: Ref<UserEntity>;

  @prop({default: 0})
  public commentsCount!: number;

  @prop({required: true, type: () => LocationEntity, _id: false})
  public location!: LocationEntity;
}

export const OfferModel = getModelForClass(OfferEntity);
