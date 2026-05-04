import { eq } from "drizzle-orm";
import { db } from "../db.js";
import { users } from "../schema/schema.js";

export async function createUser(name: string) {
  const [result] = await db.insert(users).values({ name: name }).returning();
  return result;
}

export async function getUserByName(userName: string) {
  const [result] = await db
    .select()
    .from(users)
    .where(eq(users.name, userName));

  return result;
}

export async function deleteAllUsers(): Promise<void> {
  await db.delete(users);
}
