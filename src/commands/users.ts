import { Config, readConfig, setUser } from "../config.js";
import {
  createUser,
  getUserByName,
  getUsers,
} from "../lib/database/queries/users.js";

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

export async function handlerListUsers() {
  const users = await getUsers();
  const config = readConfig();

  if (users.length === 0) {
    console.log("No users found.");
    return;
  }

  for (const user of users) {
    if (user.name === config.currentUserName) {
      console.log(`* ${user.name} (current)`);
    } else {
      console.log(`* ${user.name}`);
    }
  }
}
