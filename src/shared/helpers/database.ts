export const DEFAULT_DB_PORT = '27017';

export function getMongoUri(user: string, password: string, host: string, port: string, dbName: string): string {
  return `mongodb://${user}:${password}@${host}:${port}/${dbName}?authSource=admin`;
}
