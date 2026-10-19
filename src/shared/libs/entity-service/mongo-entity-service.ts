import {DocumentType, types} from '@typegoose/typegoose';
import {injectable, unmanaged} from 'inversify';
import {isValidObjectId} from 'mongoose';
import {EntityService} from './entity-service.interface.js';

@injectable()
export abstract class MongoEntityService<T> implements EntityService<T> {
  constructor(@unmanaged() protected readonly model: types.ModelType<T>) {}

  public async findById(id: string): Promise<DocumentType<T> | null> {
    if (!isValidObjectId(id)) {
      return null;
    }
    return this.model.findById<DocumentType<T>>(id).exec();
  }

  public async deleteById(id: string): Promise<DocumentType<T> | null> {
    if (!isValidObjectId(id)) {
      return null;
    }
    return this.model.findByIdAndDelete<DocumentType<T>>(id).exec();
  }

  public async exists(id: string): Promise<boolean> {
    if (!isValidObjectId(id)) {
      return false;
    }
    return (await this.model.exists({_id: id})) !== null;
  }
}
