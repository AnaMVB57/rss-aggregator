import { db } from "../db.js";
import { eq, sql } from "drizzle-orm";
import { feeds, posts } from "../schema/schema.js";

export async function createPost(
  title: string,
  url: string,
  description: string,
  publishedAt: string | Date,
  feedId: string,
) {
  let parsedDate: Date | null = null;

  if (publishedAt) {
    const date =
      typeof publishedAt === "string" ? new Date(publishedAt) : publishedAt;
    parsedDate = isNaN(date.getTime()) ? null : date;
  }

  const result = await db
    .insert(posts)
    .values({ title, url, description, publishedAt: parsedDate, feedId })
    .onConflictDoNothing({ target: posts.url })
    .returning();

  if (!result || result.length === 0) {
    return;
  }

  return result[0];
}

export async function getPostsForUser(userId: string, limit: number = 2) {
  const result = await db
    .select({
      id: posts.id,
      title: posts.title,
      url: posts.url,
      description: posts.description,
      publishedAt: posts.publishedAt,
      feedId: posts.feedId,
    })
    .from(posts)
    .innerJoin(feeds, eq(posts.feedId, feeds.id))
    .where(eq(feeds.user_id, userId))
    .orderBy(sql`${posts.publishedAt} DESC NULLS LAST`)
    .limit(limit);

  return result;
}
