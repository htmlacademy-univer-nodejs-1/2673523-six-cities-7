import chalk from 'chalk';
import {Offer} from '../../shared/types/index.js';
import {DEFAULT_DB_PORT, getMongoUri} from '../../shared/helpers/index.js';
import {TsvOfferReader} from '../../shared/libs/file-reader/index.js';
import {ConsoleLogger, Logger} from '../../shared/libs/logger/index.js';
import {DatabaseClient, MongoDatabaseClient} from '../../shared/libs/database-client/index.js';
import {DefaultUserService, UserModel, UserService} from '../../shared/modules/user/index.js';
import {DefaultOfferService, OfferModel, OfferService} from '../../shared/modules/offer/index.js';
import {CliCommand} from './cli-command.interface.js';

const DEFAULT_USER_PASSWORD = '123456';

export class ImportCommand implements CliCommand {
  public readonly name = '--import';

  private readonly logger: Logger = new ConsoleLogger();
  private readonly databaseClient: DatabaseClient = new MongoDatabaseClient(this.logger);
  private readonly userService: UserService = new DefaultUserService(this.logger, UserModel);
  private readonly offerService: OfferService = new DefaultOfferService(this.logger, OfferModel);

  private async saveOffer(offer: Offer, salt: string): Promise<void> {
    const user = await this.userService.findOrCreate({
      name: offer.authorEmail.split('@')[0],
      email: offer.authorEmail,
      password: DEFAULT_USER_PASSWORD,
      type: 'regular',
    }, salt);

    await this.offerService.create({
      title: offer.title,
      description: offer.description,
      postDate: offer.postDate,
      city: offer.city,
      previewImage: offer.previewImage,
      photos: offer.photos,
      isPremium: offer.isPremium,
      isFavorite: offer.isFavorite,
      rating: offer.rating,
      type: offer.type,
      roomsCount: offer.roomsCount,
      guestsCount: offer.guestsCount,
      price: offer.price,
      amenities: offer.amenities,
      authorId: user.id,
      location: offer.location,
    });
  }

  public async run(...args: string[]): Promise<void> {
    const [path, login, password, host, dbName, salt] = args;
    if (!path || !login || !password || !host || !dbName || !salt) {
      throw new Error('Использование: --import <path> <login> <password> <host> <dbname> <salt>');
    }

    await this.databaseClient.connect(getMongoUri(login, password, host, DEFAULT_DB_PORT, dbName));

    try {
      const reader = new TsvOfferReader(path);
      let imported = 0;

      for await (const offer of reader.read()) {
        await this.saveOffer(offer, salt);
        imported++;
      }

      console.info(chalk.green(`Импортировано предложений: ${chalk.bold(imported)}`));
    } finally {
      await this.databaseClient.disconnect();
    }
  }
}
