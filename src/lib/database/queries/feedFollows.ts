import { and, eq } from "drizzle-orm";
import { db } from "../db.js";
import { feedFollows, feeds, users } from "../schema/schema.js";
import { getFeedByUrl } from "./feeds.js";

export async function getFeedFollowsForUser(userId: string) {
  const result = await db
    .select({
      id: feedFollows.id,
      feedName: feeds.name,
      userName: users.name,
    })
    .from(feedFollows)
    .innerJoin(feeds, eq(feedFollows.feedId, feeds.id))
    .innerJoin(users, eq(feedFollows.userId, users.id))
    .where(eq(feedFollows.userId, userId));

  return result;
}

export async function deleteFeedFollow(userId: string, feedId: string) {
  const [result] = await db
    .delete(feedFollows)
    .where(
      and(eq(feedFollows.userId, userId), eq(feedFollows.feedId, feedId)),
    );

  return result;
}
