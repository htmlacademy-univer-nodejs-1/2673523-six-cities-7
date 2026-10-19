import {DocumentType} from '@typegoose/typegoose';

export interface EntityService<T> {
  findById(id: string): Promise<DocumentType<T> | null>;
  deleteById(id: string): Promise<DocumentType<T> | null>;
  exists(id: string): Promise<boolean>;
}
