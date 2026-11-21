import {DocumentType} from '@typegoose/typegoose';

export interface DocumentExists {
  exists(id: string): Promise<boolean>;
}

export interface EntityService<T> extends DocumentExists {
  findById(id: string): Promise<DocumentType<T> | null>;
  deleteById(id: string): Promise<DocumentType<T> | null>;
}
