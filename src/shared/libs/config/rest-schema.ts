import convict from 'convict';
import validator from 'convict-format-with-validator';

convict.addFormats(validator);

export type RestSchema = {
  PORT: number;
  DB_HOST: string;
  DB_PORT: string;
  DB_USER: string;
  DB_PASSWORD: string;
  DB_NAME: string;
  SALT: string;
};

export const restSchema = convict<RestSchema>({
  PORT: {
    doc: 'Порт для подключений',
    format: 'port',
    env: 'PORT',
    default: null,
  },
  DB_HOST: {
    doc: 'IP-адрес БД',
    format: 'ipaddress',
    env: 'DB_HOST',
    default: null,
  },
  DB_PORT: {
    doc: 'Порт БД',
    format: 'port',
    env: 'DB_PORT',
    default: null,
  },
  DB_USER: {
    doc: 'Логин БД',
    format: String,
    env: 'DB_USER',
    default: null,
  },
  DB_PASSWORD: {
    doc: 'Пароль БД',
    format: String,
    env: 'DB_PASSWORD',
    default: null,
  },
  DB_NAME: {
    doc: 'Имя БД',
    format: String,
    env: 'DB_NAME',
    default: null,
  },
  SALT: {
    doc: 'Соль хеширования паролей',
    format: String,
    env: 'SALT',
    default: null,
  },
});
