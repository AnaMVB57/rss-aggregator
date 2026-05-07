import { Feed, User } from "../database/schema/schema.js";

export function printFeed(feed: Feed, user: User) {
  console.log("------------------------------------------");
  console.log(`  ID:          ${feed.id}`);
  console.log(`  Name:        ${feed.name}`);
  console.log(`  URL:         ${feed.url}`);
  console.log(`  User:        ${user.name}`);
  console.log(`  Created at:  ${feed.createdAt}`);
  console.log("------------------------------------------");
}