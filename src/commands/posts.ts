import { getPostsForUser } from "../lib/database/queries/posts.js";
import { User } from "../lib/database/schema/schema.js";

export async function handleBrowse(
  cmdName: string,
  user: User,
  ...args: string[]
) {
  if (args.length > 1) {
    throw new Error(`Usage: ${cmdName} <limit of posts>`);
  }

  let limit: number | undefined;

  if (args.length === 1) {
    limit = Number(args[0]);
    if (isNaN(limit) || !Number.isInteger(limit) || limit < 1) {
      throw new Error(`Limit must be a valid positive integer.`);
    }
  }

  try {
    const posts = await getPostsForUser(user.id, limit);

    if (posts.length === 0) {
      console.log("No posts found.");
      return;
    }

    console.log("Posts: ");
    for (const post of posts) {
      console.log("------------------------------------------");
      console.log(`|  Name:        ${post.title}`);
      console.log(`|  Published:   ${post.publishedAt}`);
      console.log("------------------------------------------");
    }
  } catch (error) {
    throw new Error(`Failed to fetch posts: ${error}`);
  }
}
