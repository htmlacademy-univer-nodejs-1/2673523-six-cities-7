import {Amenity, City, HousingType, Location} from '../../../types/index.js';

export class CreateOfferDto {
  public title!: string;
  public description!: string;
  public postDate!: Date;
  public city!: City;
  public previewImage!: string;
  public photos!: string[];
  public isPremium!: boolean;
  public isFavorite!: boolean;
  public rating!: number;
  public type!: HousingType;
  public roomsCount!: number;
  public guestsCount!: number;
  public price!: number;
  public amenities!: Amenity[];
  public authorId!: string;
  public location!: Location;
}
