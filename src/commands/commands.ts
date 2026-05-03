import { setUser } from "../config.js";

export type CommandHandler = (cmdName: string, ...args: string[]) => void;

export type CommandsRegistry = {
  [cmdName: string]: CommandHandler;
};

export function handlerLogin(cmdName: string, ...args: string[]) {
  if (args.length !== 1) {
    throw new Error("Please enter a valid username.");
  }

  setUser(args[0]);
  console.log("User setted successfully.");
}

export function registerCommand(
  registry: CommandsRegistry,
  cmdName: string,
  handler: CommandHandler,
): void {
  registry[cmdName] = handler;
}

export function runCommand(
  registry: CommandsRegistry,
  cmdName: string,
  ...args: string[]
): void {
    const handler = registry[cmdName];
    if(!handler){
        throw new Error(`Command not found: ${cmdName}`);
    }
    handler(cmdName, ...args);
}
