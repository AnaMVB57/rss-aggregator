import { deleteAllUsers } from "../lib/database/queries/users.js";

export type CommandHandler = (
  cmdName: string,
  ...args: string[]
) => Promise<void> | void;

export type CommandsRegistry = {
  [cmdName: string]: CommandHandler;
};

export function registerCommand(
  registry: CommandsRegistry,
  cmdName: string,
  handler: CommandHandler,
): void {
  registry[cmdName] = handler;
}

export async function handleReset(){
    await deleteAllUsers();
    console.log("Users reseted successfully.");
    process.exit(0);
}

export async function runCommand(
  registry: CommandsRegistry,
  cmdName: string,
  ...args: string[]
): Promise<void> {
  const handler = registry[cmdName];
  if (!handler) {
    throw new Error(`Command not found: ${cmdName}`);
  }
  await handler(cmdName, ...args);
}
