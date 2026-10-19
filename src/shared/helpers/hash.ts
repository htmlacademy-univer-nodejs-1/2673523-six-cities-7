import {createHmac} from 'node:crypto';

export function createSha256(value: string, salt: string): string {
  return createHmac('sha256', salt).update(value).digest('hex');
}
