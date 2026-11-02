import {defaultClasses, getModelForClass, modelOptions, prop, Ref} from '@typegoose/typegoose';
import {Types} from 'mongoose';
import {User, UserType} from '../../types/index.js';
import {createSha256} from '../../helpers/index.js';
import {OfferEntity} from '../offer/index.js';

@modelOptions({schemaOptions: {collection: 'users', timestamps: true}})
export class UserEntity extends defaultClasses.TimeStamps implements Omit<User, 'password'> {
  @prop({required: true, trim: true})
  public name!: string;

  @prop({required: true, unique: true, trim: true})
  public email!: string;

  @prop({default: ''})
  public avatarUrl?: string;

  @prop({required: true})
  private password?: string;

  @prop({required: true, type: () => String, enum: ['regular', 'pro']})
  public type!: UserType;

  @prop({ref: 'OfferEntity', type: () => [Types.ObjectId], default: []})
  public favorites!: Ref<OfferEntity>[];

  constructor(user: Omit<User, 'password'>) {
    super();
    this.name = user.name;
    this.email = user.email;
    this.avatarUrl = user.avatarUrl;
    this.type = user.type;
  }

  public setPassword(password: string, salt: string): void {
    this.password = createSha256(password, salt);
  }

  public getPassword(): string | undefined {
    return this.password;
  }
}

export const UserModel = getModelForClass(UserEntity);
