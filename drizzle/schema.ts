import {
  int,
  mysqlEnum,
  mysqlTable,
  text,
  timestamp,
  varchar,
  boolean,
  json,
} from "drizzle-orm/mysql-core";

export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// 타로카드 테이블 (78장)
export const tarotCards = mysqlTable("tarot_cards", {
  id: int("id").autoincrement().primaryKey(),
  cardNumber: int("cardNumber").notNull(), // 0-77
  name: varchar("name", { length: 100 }).notNull(),
  nameKo: varchar("nameKo", { length: 100 }).notNull(),
  arcana: mysqlEnum("arcana", ["major", "minor"]).notNull(),
  suit: varchar("suit", { length: 50 }), // cups, wands, swords, pentacles (minor only)
  uprightMeaning: text("uprightMeaning").notNull(),
  reversedMeaning: text("reversedMeaning").notNull(),
  description: text("description").notNull(),
  keywords: json("keywords").$type<string[]>().notNull(),
  imageUrl: text("imageUrl"), // AI 생성 이미지 URL
  imagePrompt: text("imagePrompt"), // 이미지 생성에 사용된 프롬프트
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type TarotCard = typeof tarotCards.$inferSelect;
export type InsertTarotCard = typeof tarotCards.$inferInsert;

// 타로 리딩(상담) 테이블
export const readings = mysqlTable("readings", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").references(() => users.id),
  question: text("question").notNull(),
  spreadType: varchar("spreadType", { length: 50 }).notNull().default("three-card"), // three-card, celtic-cross, single
  interpretation: text("interpretation"), // AI 생성 해석
  isPublic: boolean("isPublic").default(false).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Reading = typeof readings.$inferSelect;
export type InsertReading = typeof readings.$inferInsert;

// 리딩-카드 관계 테이블
export const readingCards = mysqlTable("reading_cards", {
  id: int("id").autoincrement().primaryKey(),
  readingId: int("readingId").notNull().references(() => readings.id),
  cardId: int("cardId").notNull().references(() => tarotCards.id),
  position: int("position").notNull(), // 카드 위치 순서
  positionName: varchar("positionName", { length: 100 }), // 예: "과거", "현재", "미래"
  isReversed: boolean("isReversed").default(false).notNull(),
});

export type ReadingCard = typeof readingCards.$inferSelect;
export type InsertReadingCard = typeof readingCards.$inferInsert;
