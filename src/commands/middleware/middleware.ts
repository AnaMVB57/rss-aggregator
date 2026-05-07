import { readConfig } from "../../config.js";
import { getUserByName } from "../../lib/database/queries/users.js";
import { CommandHandler, UserCommandHandler } from "../commands.js";

export type middlewareLoggedIn = (handler: UserCommandHandler) => CommandHandler;

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