import { setUser } from "../config.js";
import { createUser, getUserByName } from "../lib/database/queries/users.js";

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