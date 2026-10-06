import chalk from 'chalk';
import {CliCommand} from './cli-command.interface.js';

export class HelpCommand implements CliCommand {
  public readonly name = '--help';

  public async run(): Promise<void> {
    console.info(`
${chalk.bold.magenta('Подготовка данных REST API сервера')}

${chalk.yellow('Использование:')}
  npm run cli -- ${chalk.cyan('--<command>')} ${chalk.gray('[arguments]')}

${chalk.yellow('Команды:')}
  ${chalk.cyan('--version')}                        вывод номера версии приложения
  ${chalk.cyan('--help')}                           выводит текста по умолчанию
  ${chalk.cyan('--import')} ${chalk.gray('<path>')}                  импортирует предложения из TSV-файла
  ${chalk.cyan('--generate')} ${chalk.gray('<n> <path> <url>')}      генерит TSV-файл с тест данными
`);
  }
}
