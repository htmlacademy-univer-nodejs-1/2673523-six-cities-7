import convict from 'convict';
import validator from 'convict-format-with-validator';

convict.addFormats(validator);

export type RestSchema = {
  PORT: number;
  DB_HOST: string;
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
  SALT: {
    doc: 'Соль хеширования паролей',
    format: String,
    env: 'SALT',
    default: null,
  },
});
