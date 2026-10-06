import {Amenity, Location, Offer} from '../../types/index.js';
import {
  AMENITIES,
  CITIES,
  CoordinateLimit,
  HOUSING_TYPES,
  OFFER_PHOTOS_COUNT,
  OFFER_TSV_FIELDS_COUNT,
  OfferLimit,
} from '../../constants/index.js';
import {
  checkEmail,
  checkLength,
  parseBoolean,
  parseDate,
  parseEnum,
  parseInteger,
  parseList,
  parseNumber,
} from '../../helpers/index.js';

const RATING_PATTERN = /^\d(?:[.,]\d)?$/;

function parsePhotos(value: string): string[] {
  const photos = parseList(value);
  if (photos.length !== OFFER_PHOTOS_COUNT || photos.some((photo) => !photo)) {
    throw new Error(`Ожидалось ${OFFER_PHOTOS_COUNT} фотографий, получено ${photos.length}`);
  }
  return photos;
}

function parseAmenities(value: string): Amenity[] {
  return parseList(value).map((item) => parseEnum(item, AMENITIES, 'amenities'));
}

function parseRating(value: string): number {
  if (!RATING_PATTERN.test(value)) {
    throw new Error(`Некорректный рейтинг: ${value}`);
  }
  return parseNumber(value.replace(',', '.'), 'rating', OfferLimit.Rating);
}

function parseLocation(latitude: string, longitude: string): Location {
  return {
    latitude: parseNumber(latitude, 'latitude', CoordinateLimit.Latitude),
    longitude: parseNumber(longitude, 'longitude', CoordinateLimit.Longitude),
  };
}

export function parseOffer(line: string): Offer {
  const fields = line.split('\t');
  if (fields.length !== OFFER_TSV_FIELDS_COUNT) {
    throw new Error(`Ожидалось ${OFFER_TSV_FIELDS_COUNT} полей, получено ${fields.length}`);
  }

  const [
    title, description, postDate, city, previewImage, photos, isPremium, isFavorite,
    rating, type, roomsCount, guestsCount, price, amenities, authorEmail, latitude, longitude
  ] = fields;

  return {
    title: checkLength(title, 'title', OfferLimit.Title),
    description: checkLength(description, 'description', OfferLimit.Description),
    postDate: parseDate(postDate, 'postDate'),
    city: parseEnum(city, CITIES, 'city'),
    previewImage,
    photos: parsePhotos(photos),
    isPremium: parseBoolean(isPremium, 'isPremium'),
    isFavorite: parseBoolean(isFavorite, 'isFavorite'),
    rating: parseRating(rating),
    type: parseEnum(type, HOUSING_TYPES, 'type'),
    roomsCount: parseInteger(roomsCount, 'roomsCount', OfferLimit.Rooms),
    guestsCount: parseInteger(guestsCount, 'guestsCount', OfferLimit.Guests),
    price: parseInteger(price, 'price', OfferLimit.Price),
    amenities: parseAmenities(amenities),
    authorEmail: checkEmail(authorEmail, 'authorEmail'),
    commentsCount: 0,
    location: parseLocation(latitude, longitude),
  };
}
