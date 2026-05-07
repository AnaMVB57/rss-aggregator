import { readConfig } from "../config.js";
import { db } from "../lib/database/db.js";
import { deleteFeedFollow, getFeedFollowsForUser } from "../lib/database/queries/feedFollows.js";
import { getFeedByUrl } from "../lib/database/queries/feeds.js";
import { feedFollows, feeds, User, users } from "../lib/database/schema/schema.js";
import { eq } from "drizzle-orm";

export async function handlerFollow(
  cmdName: string,
  user: User,
  ...args: string[]
) {
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

export async function createFeedFollow(userId: string, feedId: string) {
  const [newFeedFollow] = await db
    .insert(feedFollows)
    .values({
      userId,
      feedId,
    })
    .returning();

  const [result] = await db
    .select({
      id: feedFollows.id,
      createdAt: feedFollows.createdAt,
      updatedAt: feedFollows.updatedAt,
      userId: feedFollows.userId,
      feedId: feedFollows.feedId,
      feedName: feeds.name,
      userName: users.name,
    })
    .from(feedFollows)
    .innerJoin(feeds, eq(feedFollows.feedId, feeds.id))
    .innerJoin(users, eq(feedFollows.userId, users.id))
    .where(eq(feedFollows.id, newFeedFollow.id));

  return result;
}

export async function handlerListFeedFollows(
  cmdName: string,
  user: User,
  ...args: string[]
) {
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

export async function handlerUnfollow(
  cmdName: string,
  user: User,
  ...args: string[]
) {
  if (args.length !== 1) {
    throw new Error(`Usage: ${cmdName} <url>`);
  }
  const feedUrl = args[0];

  const feed = await getFeedByUrl(feedUrl);

  const result = await deleteFeedFollow(user.id, feed.id)

  if (!result) {
    throw new Error(`Failed to unfollow the feed ${feedUrl}`);
  }

  console.log(`You have unfollowed ${(await getFeedByUrl(feedUrl)).name}`);
}
