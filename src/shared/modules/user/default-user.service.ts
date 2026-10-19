import {DocumentType, types} from '@typegoose/typegoose';
import {inject, injectable} from 'inversify';
import {Component} from '../../types/index.js';
import {Logger} from '../../libs/logger/index.js';
import {MongoEntityService} from '../../libs/entity-service/index.js';
import {CreateUserDto} from './dto/create-user.dto.js';
import {UserService} from './user-service.interface.js';
import {UserEntity} from './user.entity.js';

@injectable()
export class DefaultUserService extends MongoEntityService<UserEntity> implements UserService {
  constructor(
    @inject(Component.Logger) private readonly logger: Logger,
    @inject(Component.UserModel) userModel: types.ModelType<UserEntity>,
  ) {
    super(userModel);
  }

  public async create(dto: CreateUserDto, salt: string): Promise<DocumentType<UserEntity>> {
    const user = new UserEntity(dto);
    user.setPassword(dto.password, salt);

    const result = await this.model.create(user);
    this.logger.info(`Создан пользователь ${dto.email}`);
    return result;
  }

  public async findByEmail(email: string): Promise<DocumentType<UserEntity> | null> {
    return this.model.findOne<DocumentType<UserEntity>>({email}).exec();
  }

  public async findOrCreate(dto: CreateUserDto, salt: string): Promise<DocumentType<UserEntity>> {
    const user = await this.findByEmail(dto.email);
    return user ?? this.create(dto, salt);
  }
}
