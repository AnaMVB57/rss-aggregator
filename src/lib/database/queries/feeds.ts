import { eq } from "drizzle-orm";
import { db } from "../db.js";
import { feeds, users } from "../schema/schema.js";

export async function createFeed(name: string, url: string, userId: string) {
  const [result] = await db
    .insert(feeds)
    .values({ name, url, user_id: userId })
    .returning();
  return result;
}

export async function getAllFeeds() {
  let result = [];
    result = await db.select().from(feeds);
    return result; 
}

export async function getUserByFeedUserId(userId: string) {
  const [result] = await db
    .select()
    .from(users)
    .where(eq(users.id, userId));
  return result;
}

export async function getFeedByUrl(url: string) {
  const [result] = await db
    .select()
    .from(feeds)
    .where(eq(feeds.url, url));
  return result;
}