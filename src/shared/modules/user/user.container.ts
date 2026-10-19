import {types} from '@typegoose/typegoose';
import {Container} from 'inversify';
import {Component} from '../../types/index.js';
import {DefaultUserService} from './default-user.service.js';
import {UserService} from './user-service.interface.js';
import {UserEntity, UserModel} from './user.entity.js';

export function createUserContainer(): Container {
  const container = new Container();
  container.bind<UserService>(Component.UserService).to(DefaultUserService).inSingletonScope();
  container.bind<types.ModelType<UserEntity>>(Component.UserModel).toConstantValue(UserModel);
  return container;
}
