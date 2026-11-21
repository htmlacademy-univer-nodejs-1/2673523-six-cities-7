import {mkdir, open, rm} from 'node:fs/promises';
import {join} from 'node:path';
import {NextFunction, Request, Response} from 'express';
import {StatusCodes} from 'http-status-codes';
import mimeTypes from 'mime-types';
import multer from 'multer';
import {nanoid} from 'nanoid';
import {HttpError, Middleware} from '../../libs/rest/index.js';

const MAX_AVATAR_SIZE = 2 * 1024 * 1024;
const IMAGE_SIGNATURES = new Map([
  ['image/jpeg', 'ffd8ff'],
  ['image/png', '89504e470d0a1a0a'],
]);

export class UploadAvatarMiddleware implements Middleware {
  private readonly upload = multer({
    storage: multer.memoryStorage(),
    limits: {fileSize: MAX_AVATAR_SIZE, files: 1, fields: 0},
  }).single('avatar');

  constructor(private readonly directory: string) {}

  private parseFile(req: Request, res: Response): Promise<void> {
    return new Promise((resolve, reject) => {
      this.upload(req, res, (error: unknown) => {
        if (error) {
          const message = error instanceof multer.MulterError && error.code === 'LIMIT_FILE_SIZE'
            ? 'Размер аватара не должен превышать 2 МиБ'
            : 'Отправьте один файл в поле avatar';
          reject(new HttpError(StatusCodes.BAD_REQUEST, message));
          return;
        }
        resolve();
      });
    });
  }

  public async execute(req: Request, res: Response, next: NextFunction): Promise<void> {
    await this.parseFile(req, res);

    const file = req.file;
    if (!file) {
      throw new HttpError(StatusCodes.BAD_REQUEST, 'Отправьте один файл в поле avatar');
    }

    const signature = IMAGE_SIGNATURES.get(file.mimetype);
    const extension = mimeTypes.extension(file.mimetype);
    if (!signature || !extension || file.buffer.toString('hex', 0, signature.length / 2) !== signature) {
      throw new HttpError(StatusCodes.BAD_REQUEST, 'Загрузите изображение в формате JPG или PNG');
    }

    const filename = `${nanoid()}.${extension}`;
    const path = join(this.directory, filename);
    await mkdir(this.directory, {recursive: true});
    const handle = await open(path, 'wx');
    try {
      await handle.writeFile(file.buffer).finally(() => handle.close());
    } catch (error) {
      await rm(path, {force: true}).catch(() => undefined);
      throw error;
    }

    file.filename = filename;
    file.path = path;
    next();
  }
}
