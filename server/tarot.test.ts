import { describe, expect, it, vi, beforeEach } from "vitest";

// Canvas 모듈 모의 처리
vi.mock("canvas");

import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

// Mock DB functions
vi.mock("./db", () => ({
  getAllTarotCards: vi.fn().mockResolvedValue([
    {
      id: 1,
      cardNumber: 0,
      name: "The Fool",
      nameKo: "바보",
      arcana: "major",
      suit: null,
      uprightMeaning: "새로운 시작, 순수함",
      reversedMeaning: "무모함, 위험 감수",
      description: "바보 카드는 여정의 시작을 상징합니다.",
      keywords: ["새로운 시작", "순수함"],
      imageUrl: null,
      imagePrompt: "The Fool tarot card",
      createdAt: new Date(),
    },
    {
      id: 2,
      cardNumber: 1,
      name: "The Magician",
      nameKo: "마법사",
      arcana: "major",
      suit: null,
      uprightMeaning: "의지력, 기술",
      reversedMeaning: "조작, 기만",
      description: "마법사는 하늘과 땅을 연결합니다.",
      keywords: ["의지력", "기술"],
      imageUrl: null,
      imagePrompt: "The Magician tarot card",
      createdAt: new Date(),
    },
  ]),
  getTarotCardById: vi.fn().mockImplementation((id: number) =>
    Promise.resolve({
      id,
      cardNumber: id - 1,
      name: "The Fool",
      nameKo: "바보",
      arcana: "major",
      suit: null,
      uprightMeaning: "새로운 시작",
      reversedMeaning: "무모함",
      description: "바보 카드",
      keywords: ["새로운 시작"],
      imageUrl: null,
      imagePrompt: "The Fool tarot card",
      createdAt: new Date(),
    })
  ),
  createReading: vi.fn().mockResolvedValue({ insertId: 42 }),
  createReadingCards: vi.fn().mockResolvedValue(undefined),
  updateReadingInterpretation: vi.fn().mockResolvedValue(undefined),
  updateCardImageUrl: vi.fn().mockResolvedValue(undefined),
  getUserReadings: vi.fn().mockResolvedValue([]),
  getReadingWithCards: vi.fn().mockResolvedValue({
    reading: {
      id: 1,
      userId: null,
      question: "테스트 질문",
      spreadType: "three-card",
      interpretation: "테스트 해석",
      isPublic: false,
      createdAt: new Date(),
    },
    cards: [],
  }),
  getAnonymousReadingsByIds: vi.fn().mockResolvedValue([]),
}));

vi.mock("./_core/llm", () => ({
  invokeLLM: vi.fn().mockResolvedValue({
    choices: [{ message: { content: "AI 타로 해석 결과입니다." } }],
  }),
}));

vi.mock("./_core/imageGeneration", () => ({
  generateImage: vi.fn().mockResolvedValue({ url: "https://example.com/image.png" }),
}));

function createPublicContext(): TrpcContext {
  return {
    user: null,
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: { clearCookie: vi.fn() } as unknown as TrpcContext["res"],
  };
}

function createAuthContext(): TrpcContext {
  return {
    user: {
      id: 1,
      openId: "test-user",
      email: "test@example.com",
      name: "테스트 사용자",
      loginMethod: "manus",
      role: "user",
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignedIn: new Date(),
    },
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: { clearCookie: vi.fn() } as unknown as TrpcContext["res"],
  };
}

describe("tarot.getAllCards", () => {
  it("모든 타로카드 목록을 반환한다", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    const cards = await caller.tarot.getAllCards();
    expect(cards).toHaveLength(2);
    expect(cards[0].name).toBe("The Fool");
    expect(cards[1].name).toBe("The Magician");
  });
});

describe("tarot.getCard", () => {
  it("특정 카드 정보를 반환한다", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    const card = await caller.tarot.getCard({ id: 1 });
    expect(card).toBeDefined();
    expect(card?.nameKo).toBe("바보");
  });
});

describe("tarot.createReading", () => {
  it("타로 리딩을 생성하고 AI 해석을 반환한다", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.tarot.createReading({
      question: "제 미래는 어떻게 될까요?",
      spreadType: "three-card",
      selectedCardIds: [1, 2, 1],
      reversedStates: [false, true, false],
    });
    expect(result.readingId).toBe(42);
    expect(result.interpretation).toBe("AI 타로 해석 결과입니다.");
  });
});

describe("tarot.getReading", () => {
  it("리딩 상세 정보를 반환한다", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.tarot.getReading({ readingId: 1 });
    expect(result).toBeDefined();
    expect(result?.reading.question).toBe("테스트 질문");
  });
});

describe("tarot.getMyReadings", () => {
  it("인증된 사용자의 리딩 목록을 반환한다", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);
    const readings = await caller.tarot.getMyReadings();
    expect(Array.isArray(readings)).toBe(true);
  });

  it("비인증 사용자는 접근할 수 없다", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    await expect(caller.tarot.getMyReadings()).rejects.toThrow();
  });
});

describe("tarot.getAnonymousReadings", () => {
  it("익명 리딩 목록을 반환한다", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.tarot.getAnonymousReadings({ readingIds: [1, 2] });
    expect(Array.isArray(result)).toBe(true);
  });
});
