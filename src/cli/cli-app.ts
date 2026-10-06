import {CliCommand} from './commands/cli-command.interface.js';
import {parseArgv} from './parse-argv.js';

export class CliApp {
  private readonly commands: Record<string, CliCommand> = {};

  constructor(private readonly defaultCommand = '--help') {}

  public register(...commands: CliCommand[]): this {
    for (const command of commands) {
      if (command.name in this.commands) {
        throw new Error(`${command.name} уже зарегистрирована`);
      }
      this.commands[command.name] = command;
    }
    return this;
  }

  public async run(argv: string[]): Promise<void> {
    const {command = this.defaultCommand, args} = parseArgv(argv);
    const handler = this.commands[command];

    if (!handler) {
      throw new Error(`Неизвестная команда ${command}`);
    }
    await handler.run(...args);
  }
}
