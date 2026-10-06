import {readFile} from 'node:fs/promises';
import {dirname, resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import chalk from 'chalk';
import {CliCommand} from './cli-command.interface.js';

type PackageInfo = {
  version: string;
};

function isPackageInfo(value: unknown): value is PackageInfo {
  return typeof value === 'object' && value !== null
    && 'version' in value && typeof value.version === 'string';
}

export class VersionCommand implements CliCommand {
  public readonly name = '--version';

  private async readVersion(): Promise<string> {
    const currentDir = dirname(fileURLToPath(import.meta.url));
    const packagePath = resolve(currentDir, '../../../package.json');
    const content: unknown = JSON.parse(await readFile(packagePath, 'utf-8'));

    if (!isPackageInfo(content)) {
      throw new Error('Не найдено поле version');
    }
    return content.version;
  }

  public async run(): Promise<void> {
    const version = await this.readVersion();
    console.info(`${chalk.gray('Версия:')} ${chalk.bold.green(version)}`);
  }
}
