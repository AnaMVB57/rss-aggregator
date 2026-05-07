import { XMLParser } from "fast-xml-parser";
import { Feed, User } from "../lib/database/schema/schema.js";
import { readConfig } from "../config.js";
import {
  createFeed,
  getAllFeeds,
  getUserByFeedUserId,
  scrapeFeeds,
} from "../lib/database/queries/feeds.js";
import { createFeedFollow } from "./feedFollows.js";

type RSSFeed = {
  channel: {
    title: string;
    link: string;
    description: string;
    item: RSSItem[];
  };
};

type RSSItem = {
  title: string;
  link: string;
  description: string;
  pubDate: string;
};

export async function handlerAddFeed(
  cmdName: string,
  user: User,
  ...args: string[]
) {
  if (args.length !== 2) {
    throw new Error(`Usage: ${cmdName} <name> <url>`);
  }

  const config = readConfig();
  const currentUser = config.currentUserName;

  if (!currentUser) {
    throw new Error("No current user set. Please login first.");
  }

  if (!user) {
    throw new Error(`User ${currentUser} not found in database.`);
  }

  const feedName = args[0];
  const url = args[1];
  const feed = await createFeed(feedName, url, user.id);

  if (!feed) {
    throw new Error(`Failed to create feed.`);
  }

  const feedFollow = await createFeedFollow(user.id, feed.id); // ← nuevo
  console.log(`Following feed: ${feedFollow.feedName}`);

  console.log("Feed created successfully!");
  printFeed(feed, user);
}

export async function handlerFeeds() {
  try {
    const allFeeds = await getAllFeeds();

    if (allFeeds.length === 0) {
      console.log("No feeds found.");
      return;
    }

    console.log("Feeds: ");
    for (const feed of allFeeds) {
      const user = await getUserByFeedUserId(feed.user_id);
      console.log("------------------------------------------");
      console.log(`|  Name:        ${feed.name}`);
      console.log(`|  URL:         ${feed.url}`);
      console.log(`|  User:        ${user?.name ?? "unknown"}`);
      console.log("------------------------------------------");
    }
  } catch (error) {
    throw new Error(`Error: ${error}`);
  }
}

function parseDuration(durationStr: string): number {
  const regex = /^(\d+)(ms|s|m|h)$/;
  const match = durationStr.match(regex);

  if (!match) {
    throw new Error(
      `Invalid duration format: ${durationStr}. Use formats like 1s, 1m, 1h`,
    );
  }

  const value = parseInt(match[1]);
  const unit = match[2];

  switch (unit) {
    case "ms":
      return value;
    case "s":
      return value * 1000;
    case "m":
      return value * 60000;
    case "h":
      return value * 3600000;
    default:
      throw new Error(`Unknown unit: ${unit}`);
  }
}

function printFeed(feed: Feed, user: User) {
  console.log("------------------------------------------");
  console.log(`  ID:          ${feed.id}`);
  console.log(`  Name:        ${feed.name}`);
  console.log(`  URL:         ${feed.url}`);
  console.log(`  User:        ${user.name}`);
  console.log(`  Created at:  ${feed.createdAt}`);
  console.log("------------------------------------------");
}

export async function handleAggregate(cmdName: string, ...args: string[]) {
  if (args.length !== 1) {
    throw new Error(`Usage: ${cmdName} <time_between_reqs> (e.g. 1s, 1m, 1h)`);
  }

  const timeBetweenRequests = args[0];
  const duration = parseDuration(timeBetweenRequests);

  if (!duration) {
    throw new Error(`Invalid duration - ${duration} - use format (1000ms, 1s, 1m or 1h)`);
  }

  console.log(`Collecting feeds every ${timeBetweenRequests}`);

  scrapeFeeds().catch(console.error);

  const interval = setInterval(() => {
    scrapeFeeds().catch(console.error);
  }, duration);

  await new Promise<void>((resolve) => {
    process.on("SIGINT", () => {
      console.log("Shutting down feed aggregator...");
      clearInterval(interval);
      resolve();
    });
  });
}

export async function fetchFeed(feedURL: string): Promise<RSSFeed> {
  const response = await fetch(feedURL, {
    headers: { "User-Agent": "rss_aggregator" },
  });

  const text = await response.text();
  const xmlParser = new XMLParser({ processEntities: false });
  const parsedFeed = xmlParser.parse(text);

  if (!parsedFeed.rss.channel) {
    throw new Error("Error - Channel does not exist.");
  }

  const channel = parsedFeed.rss.channel;

  if (typeof channel.title !== "string") {
    throw new Error("Invalid RSS feed - missing title field.");
  }
  if (typeof channel.link !== "string") {
    throw new Error("Invalid RSS feed - missing link field.");
  }
  if (typeof channel.description !== "string") {
    throw new Error("Invalid RSS feed - missing description field.");
  }

  let rawItems = [];
  if (channel.item) {
    rawItems = Array.isArray(channel.item) ? channel.item : [channel.item];
  }

  const items: RSSItem[] = [];
  for (const item of rawItems) {
    if (
      typeof item.title !== "string" ||
      typeof item.link !== "string" ||
      typeof item.description !== "string" ||
      typeof item.pubDate !== "string"
    ) {
      continue;
    }
    items.push({
      title: item.title,
      link: item.link,
      description: item.description,
      pubDate: item.pubDate,
    });
  }

  return {
    channel: {
      title: channel.title,
      link: channel.link,
      description: channel.description,
      item: items,
    },
  };
}
