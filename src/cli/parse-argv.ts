export type ParsedArgv = {
  command: string | undefined;
  args: string[];
};

export function parseArgv(argv: string[]): ParsedArgv {
  const [command, ...args] = argv;
  return {command, args};
}
