import { setUser } from "../config.js";
import { db } from "../lib/database/db.js";
import { createUser, deleteAllUsers, getUserByName } from "../lib/database/queries/users.js";

export type CommandHandler = (
  cmdName: string,
  ...args: string[]
) => Promise<void> | void;

export type CommandsRegistry = {
  [cmdName: string]: CommandHandler;
};

export async function handlerLogin(cmdName: string, ...args: string[]) {
  if (args.length !== 1) {
    throw new Error("Please enter a valid username.");
  }

  const userName = args[0];
  const existingUser = await getUserByName(userName);

  if (!existingUser) {
    throw new Error(`User ${userName} does not exist.`);
  }

  setUser(userName);
  console.log("User setted successfully.");
}

export function registerCommand(
  registry: CommandsRegistry,
  cmdName: string,
  handler: CommandHandler,
): void {
  registry[cmdName] = handler;
}

export async function handlerRegister(cmdName: string, ...args: string[]) {
  if (args.length !== 1) {
    throw new Error("Please enter a valid username.");
  }

  const userName = args[0];
  const existingUser = await getUserByName(userName);

  if (existingUser) {
    throw new Error(`User ${userName} already exists.`);
  }

  const newUser = await createUser(userName);
  setUser(userName);
  console.log(`User ${newUser.name} registered successfully.`);
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
