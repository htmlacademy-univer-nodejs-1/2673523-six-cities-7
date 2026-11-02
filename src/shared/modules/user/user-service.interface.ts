import {DocumentType} from '@typegoose/typegoose';
import {EntityService} from '../../libs/entity-service/index.js';
import {OfferEntity} from '../offer/index.js';
import {CreateUserDto} from './dto/create-user.dto.js';
import {UpdateUserDto} from './dto/update-user.dto.js';
import {UserEntity} from './user.entity.js';

export interface UserService extends EntityService<UserEntity> {
  create(dto: CreateUserDto, salt: string): Promise<DocumentType<UserEntity>>;
  findByEmail(email: string): Promise<DocumentType<UserEntity> | null>;
  findOrCreate(dto: CreateUserDto, salt: string): Promise<DocumentType<UserEntity>>;
  updateById(userId: string, dto: UpdateUserDto): Promise<DocumentType<UserEntity> | null>;
  findFavorites(userId: string): Promise<DocumentType<OfferEntity>[]>;
  addToFavorites(userId: string, offerId: string): Promise<DocumentType<UserEntity> | null>;
  removeFromFavorites(userId: string, offerId: string): Promise<DocumentType<UserEntity> | null>;
}
