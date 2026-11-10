import {ClassConstructor, plainToInstance} from 'class-transformer';

export function fillDto<T, V>(dto: ClassConstructor<T>, plainObject: V): T {
  return plainToInstance(dto, plainObject, {excludeExtraneousValues: true});
}

export function createErrorObject(message: string) {
  return {message};
}
