import {createReadStream} from 'node:fs';
import {createInterface} from 'node:readline';
import {Offer} from '../../types/index.js';
import {Reader} from './reader.interface.js';
import {parseOffer} from './parse-offer.js';

export class TsvOfferReader implements Reader<Offer> {
  constructor(private readonly path: string) {}

  public async *read(): AsyncGenerator<Offer> {
    const stream = createReadStream(this.path, {encoding: 'utf-8'});
    const reader = createInterface({input: stream, crlfDelay: Infinity});
    let lineIndex = 0;

    try {
      for await (const rawLine of reader) {
        lineIndex++;
        const line = rawLine.replace(/^\uFEFF/, '');
        if (line.trim() === '') {
          continue;
        }

        try {
          yield parseOffer(line);
        } catch (error) {
          const message = error instanceof Error ? error.message : String(error);
          throw new Error(`Ошибка в строке ${lineIndex}: ${message}`);
        }
      }
    } finally {
      reader.close();
      stream.destroy();
    }
  }
}
