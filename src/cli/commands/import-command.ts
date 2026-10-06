import chalk from 'chalk';
import {TsvOfferReader} from '../../shared/libs/file-reader/index.js';
import {CliCommand} from './cli-command.interface.js';

export class ImportCommand implements CliCommand {
  public readonly name = '--import';

  public async run(...args: string[]): Promise<void> {
    const [path] = args;
    if (!path) {
      throw new Error('Не указан путь к файлу');
    }

    const reader = new TsvOfferReader(path);
    let imported = 0;

    for await (const offer of reader.read()) {
      imported++;
      console.info(chalk.bold.cyan(`\n#${imported} ${offer.title}`));
      console.info(offer);
    }

    console.info(chalk.green(`\nИмпортировано предложений: ${chalk.bold(imported)}`));
  }
}
