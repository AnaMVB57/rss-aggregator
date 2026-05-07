import { readConfig } from "../config.js";
import { getFeedFollowsForUser } from "../lib/database/queries/feedfollows.js";
import { getFeedByUrl } from "../lib/database/queries/feeds.js";
import { getUserByName } from "../lib/database/queries/users.js";
import { User } from "../lib/database/schema/schema.js";
import { createFeedFollow } from "./feeds.js";

export async function handlerFollow(cmdName: string, user: User, ...args: string[]) {
  if (args.length !== 1) {
    throw new Error(`Usage: ${cmdName} <url>`);
  }
  const url = args[0];
  const config = readConfig();
  const currentUser = config.currentUserName;

  if (!currentUser) {
    throw new Error("No current user configured");
  }

  const feed = await getFeedByUrl(url);
  if (!feed) {
    throw new Error(`User ${feed} not found.`);
  }

  const feedFollow = await createFeedFollow(user.id, feed.id);
  console.log(`Following feed: ${feedFollow.feedName}`);
  console.log(`User: ${feedFollow.userName}`);
}

export async function handlerFollowing(cmdName: string, user: User, ...args: string[]) {
  const config = readConfig();
  const currentUser = config.currentUserName;

  if (!currentUser) {
    throw new Error("No current user configured");
  }

  const userFollows = await getFeedFollowsForUser(user.id);

  if (userFollows.length === 0) {
    console.log("You are not following any feeds.");
    return;
  }

  console.log("Following feeds: ");
  for (const follow of userFollows) {
    console.log("------------------------------------------");

    console.log(`-> ${follow.feedName}`);
    console.log("------------------------------------------");
  }
}
