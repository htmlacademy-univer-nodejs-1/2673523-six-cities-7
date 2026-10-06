import {Amenity} from './amenity.type.js';
import {City} from './city.type.js';
import {HousingType} from './housing-type.type.js';
import {Location} from './location.type.js';
import {User} from './user.type.js';

export type Offer = {
  title: string;
  description: string;
  postDate: Date;
  city: City;
  previewImage: string;
  photos: string[];
  isPremium: boolean;
  isFavorite: boolean;
  rating: number;
  type: HousingType;
  roomsCount: number;
  guestsCount: number;
  price: number;
  amenities: Amenity[];
  authorEmail: User['email'];
  commentsCount: number;
  location: Location;
};
