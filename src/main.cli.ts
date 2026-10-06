import chalk from 'chalk';
import {CliApp, HelpCommand, ImportCommand, VersionCommand} from './cli/index.js';

const app = new CliApp().register(
  new HelpCommand(),
  new VersionCommand(),
  new ImportCommand(),
);

app.run(process.argv.slice(2)).catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(chalk.red(`Ошибка: ${message}`));
  process.exitCode = 1;
});
