import { eq, sql } from "drizzle-orm";
import { db } from "../db.js";
import { feeds, users } from "../schema/schema.js";
import { fetchFeed } from "../../../commands/feeds.js";
import { createPost } from "./posts.js";

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
  const [result] = await db.select().from(users).where(eq(users.id, userId));
  return result;
}

export async function getFeedByUrl(url: string) {
  const [result] = await db.select().from(feeds).where(eq(feeds.url, url));
  return result;
}

export async function markFeedFetched(feedId: string) {
  await db
    .update(feeds)
    .set({ lastFetchedAt: new Date(), updatedAt: new Date() })
    .where(eq(feeds.id, feedId));
}

export async function getNextFeedToFetch() {
  const [result] = await db
    .select()
    .from(feeds)
    .orderBy(sql`${feeds.lastFetchedAt} NULLS FIRST`)
    .limit(1);
  return result;
}

export async function scrapeFeeds() {
  const feedToFetch = await getNextFeedToFetch();

  if (!feedToFetch) {
    console.log("No feeds to fetch.");
    return;
  }

  console.log(`Fetching feed: ${feedToFetch.name}`);
  await markFeedFetched(feedToFetch.id);

  try {
    const feed = await fetchFeed(feedToFetch.url);

    for (const item of feed.channel.item) {

      await createPost(
        item.title || "Untitled",
        item.link,
        item.description || "",
        item.pubDate,
        feedToFetch.id,
      ).catch((err) => {
        if (err.message.includes("unique constraint")) {
        } else {
          console.error(`Error creating post: ${err.message}`);
        }
      });
    }
  } catch (error) {
    console.error(`Error scraping ${feedToFetch.name}:`, error);
  }
}
