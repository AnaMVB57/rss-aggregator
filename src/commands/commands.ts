import { readConfig } from "../config.js";
import { deleteAllUsers, getUserByName } from "../lib/database/queries/users.js";
import { User } from "../lib/database/schema/schema.js";

export type CommandHandler = (
  cmdName: string,
  ...args: string[]
) => Promise<void> | void;

export type UserCommandHandler = (
  cmdName: string,
  user: User,
  ...args: string[]
) => Promise<void> | void;

export type CommandsRegistry = {
  [cmdName: string]: CommandHandler;
};

type middlewareLoggedIn = (handler: UserCommandHandler) => CommandHandler;

export function middlewareLoggedIn(handler: UserCommandHandler): CommandHandler {
  return async (cmdName: string, ...args: string[]) => {
    const config = readConfig();
    const currentUser = config.currentUserName;

    if (!currentUser) {
      throw new Error("No current user configured. Please login first.");
    }

    const user = await getUserByName(currentUser);
    if (!user) {
      throw new Error(`User ${currentUser} not found in database.`);
    }

    await handler(cmdName, user, ...args);
  };
}

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

