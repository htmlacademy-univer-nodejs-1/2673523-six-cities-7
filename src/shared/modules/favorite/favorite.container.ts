import {Container} from 'inversify';
import {Component} from '../../types/index.js';
import {Controller} from '../../libs/rest/index.js';
import {FavoriteController} from './favorite.controller.js';

export function createFavoriteContainer(): Container {
  const container = new Container();
  container.bind<Controller>(Component.FavoriteController).to(FavoriteController).inSingletonScope();
  return container;
}
