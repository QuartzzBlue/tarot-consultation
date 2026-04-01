import { eq, desc, and } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, tarotCards, readings, readingCards } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = { openId: user.openId };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) values.lastSignedIn = new Date();
    if (Object.keys(updateSet).length === 0) updateSet.lastSignedIn = new Date();

    await db.insert(users).values(values).onDuplicateKeyUpdate({ set: updateSet });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

// ===== Tarot Card Queries =====

export async function getAllTarotCards() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(tarotCards).orderBy(tarotCards.cardNumber);
}

export async function getTarotCardById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(tarotCards).where(eq(tarotCards.id, id)).limit(1);
  return result[0];
}

export async function updateCardImageUrl(cardId: number, imageUrl: string) {
  const db = await getDb();
  if (!db) return;
  await db.update(tarotCards).set({ imageUrl }).where(eq(tarotCards.id, cardId));
}

// ===== Reading Queries =====

export async function createReading(data: {
  userId?: number;
  question: string;
  spreadType: string;
  interpretation?: string;
}) {
  const db = await getDb();
  if (!db) throw new Error("DB not available");
  const result = await db.insert(readings).values({
    userId: data.userId,
    question: data.question,
    spreadType: data.spreadType,
    interpretation: data.interpretation,
  });
  return result[0];
}

export async function updateReadingInterpretation(readingId: number, interpretation: string) {
  const db = await getDb();
  if (!db) return;
  await db.update(readings).set({ interpretation }).where(eq(readings.id, readingId));
}

export async function createReadingCards(cards: Array<{
  readingId: number;
  cardId: number;
  position: number;
  positionName?: string;
  isReversed: boolean;
}>) {
  const db = await getDb();
  if (!db) throw new Error("DB not available");
  await db.insert(readingCards).values(cards);
}

export async function getReadingById(readingId: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(readings).where(eq(readings.id, readingId)).limit(1);
  return result[0];
}

export async function getReadingWithCards(readingId: number) {
  const db = await getDb();
  if (!db) return undefined;

  const reading = await db.select().from(readings).where(eq(readings.id, readingId)).limit(1);
  if (!reading[0]) return undefined;

  const cards = await db
    .select({
      readingCard: readingCards,
      card: tarotCards,
    })
    .from(readingCards)
    .innerJoin(tarotCards, eq(readingCards.cardId, tarotCards.id))
    .where(eq(readingCards.readingId, readingId))
    .orderBy(readingCards.position);

  return { reading: reading[0], cards };
}

export async function getUserReadings(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db
    .select()
    .from(readings)
    .where(eq(readings.userId, userId))
    .orderBy(desc(readings.createdAt))
    .limit(20);
}

export async function getAnonymousReadingsByIds(readingIds: number[]) {
  const db = await getDb();
  if (!db) return [];
  if (readingIds.length === 0) return [];
  // Fetch multiple readings by id
  const results = [];
  for (const id of readingIds) {
    const r = await db.select().from(readings).where(eq(readings.id, id)).limit(1);
    if (r[0]) results.push(r[0]);
  }
  return results;
}
