import {Amenity, City, HousingType, Location} from '../../../types/index.js';

export class UpdateOfferDto {
  public title?: string;
  public description?: string;
  public city?: City;
  public previewImage?: string;
  public photos?: string[];
  public isPremium?: boolean;
  public type?: HousingType;
  public roomsCount?: number;
  public guestsCount?: number;
  public price?: number;
  public amenities?: Amenity[];
  public location?: Location;
}
