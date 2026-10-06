import {Amenity, City, HousingType} from '../types/index.js';

export const CITIES: City[] = ['Paris', 'Cologne', 'Brussels', 'Amsterdam', 'Hamburg', 'Dusseldorf'];
export const HOUSING_TYPES: HousingType[] = ['apartment', 'house', 'room', 'hotel'];
export const AMENITIES: Amenity[] = [
  'Breakfast',
  'Air conditioning',
  'Laptop friendly workspace',
  'Baby seat',
  'Washer',
  'Towels',
  'Fridge',
];

export const OFFER_TSV_FIELDS_COUNT = 17;
export const OFFER_PHOTOS_COUNT = 6;

export const OfferLimit = {
  Title: {min: 10, max: 100},
  Description: {min: 20, max: 1024},
  Rating: {min: 1, max: 5},
  Rooms: {min: 1, max: 8},
  Guests: {min: 1, max: 10},
  Price: {min: 100, max: 100000},
} as const;

export const CoordinateLimit = {
  Latitude: {min: -90, max: 90},
  Longitude: {min: -180, max: 180},
} as const;
