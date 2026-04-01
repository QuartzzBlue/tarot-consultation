import { z } from "zod";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import {
  getAllTarotCards,
  getTarotCardById,
  createReading,
  createReadingCards,
  getReadingWithCards,
  getUserReadings,
  updateReadingInterpretation,
  updateCardImageUrl,
  getAnonymousReadingsByIds,
} from "./db";
import { invokeLLM } from "./_core/llm";
import { generateImage } from "./_core/imageGeneration";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),

  tarot: router({
    // 모든 타로카드 조회
    getAllCards: publicProcedure.query(async () => {
      return await getAllTarotCards();
    }),

    // 특정 카드 조회
    getCard: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return await getTarotCardById(input.id);
      }),

    // 타로 리딩 생성 (AI 해석 포함)
    createReading: publicProcedure
      .input(
        z.object({
          question: z.string().min(1),
          spreadType: z.enum(["single", "three-card", "celtic-cross"]),
          selectedCardIds: z.array(z.number()).min(1),
          reversedStates: z.array(z.boolean()),
        })
      )
      .mutation(async ({ ctx, input }) => {
        const userId = ctx.user?.id;

        // 1. 리딩 생성
        const readingResult = await createReading({
          userId,
          question: input.question,
          spreadType: input.spreadType,
        });
        const readingId = Number(readingResult.insertId);

        // 2. 선택된 카드 정보 가져오기
        const cardsData = await Promise.all(
          input.selectedCardIds.map(async (cardId, idx) => {
            const card = await getTarotCardById(cardId);
            if (!card) throw new Error(`Card ${cardId} not found`);
            return { card, position: idx, isReversed: input.reversedStates[idx] };
          })
        );

        // 3. 리딩-카드 관계 저장
        const positionNames: Record<string, string[]> = {
          single: ["현재"],
          "three-card": ["과거", "현재", "미래"],
          "celtic-cross": [
            "현재 상황",
            "도전",
            "과거",
            "미래",
            "의식",
            "잠재의식",
            "조언",
            "외부 영향",
            "희망과 두려움",
            "결과",
          ],
        };

        await createReadingCards(
          cardsData.map((cd, idx) => ({
            readingId,
            cardId: cd.card.id,
            position: idx,
            positionName: positionNames[input.spreadType]?.[idx] || `위치 ${idx + 1}`,
            isReversed: cd.isReversed,
          }))
        );

        // 4. AI 해석 생성
        const cardDescriptions = cardsData
          .map((cd) => {
            const meaning = cd.isReversed
              ? cd.card.reversedMeaning
              : cd.card.uprightMeaning;
            const orientation = cd.isReversed ? "역방향" : "정방향";
            const posName =
              positionNames[input.spreadType]?.[cd.position] || `위치 ${cd.position + 1}`;
            return `- ${posName}: ${cd.card.nameKo} (${cd.card.name}) - ${orientation}\n  의미: ${meaning}\n  키워드: ${cd.card.keywords.join(", ")}`;
          })
          .join("\n\n");

        const llmPrompt = `당신은 전문 타로 리더입니다. 다음 질문과 선택된 카드들을 바탕으로 깊이 있고 통찰력 있는 타로 해석을 제공해주세요.

질문: ${input.question}

선택된 카드:
${cardDescriptions}

위 카드들의 조합을 바탕으로, 질문자의 상황에 대한 종합적이고 의미 있는 해석을 제공해주세요. 각 카드의 위치와 의미를 연결하여 전체적인 이야기를 만들어주세요. 해석은 우아하고 신비로운 어조로 작성해주세요.`;

        try {
          const llmResponse = await invokeLLM({
            messages: [
              { role: "system", content: "당신은 경험 많은 타로 리더입니다." },
              { role: "user", content: llmPrompt },
            ],
          });

          const rawContent = llmResponse.choices[0]?.message?.content;
          const interpretation = typeof rawContent === 'string' ? rawContent : "해석을 생성할 수 없습니다.";
          await updateReadingInterpretation(readingId, interpretation);

          return { readingId, interpretation };
        } catch (error) {
          console.error("LLM interpretation error:", error);
          return { readingId, interpretation: "해석 생성 중 오류가 발생했습니다." };
        }
      }),

    // 리딩 상세 조회
    getReading: publicProcedure
      .input(z.object({ readingId: z.number() }))
      .query(async ({ input }) => {
        return await getReadingWithCards(input.readingId);
      }),

    // 사용자 리딩 히스토리 조회
    getMyReadings: protectedProcedure.query(async ({ ctx }) => {
      return await getUserReadings(ctx.user.id);
    }),

    // 익명 사용자 리딩 조회 (로컬 스토리지 ID 기반)
    getAnonymousReadings: publicProcedure
      .input(z.object({ readingIds: z.array(z.number()) }))
      .query(async ({ input }) => {
        return await getAnonymousReadingsByIds(input.readingIds);
      }),

    // 카드 이미지 생성
    generateCardImage: publicProcedure
      .input(z.object({ cardId: z.number() }))
      .mutation(async ({ input }) => {
        const card = await getTarotCardById(input.cardId);
        if (!card) throw new Error("Card not found");
        if (card.imageUrl) return { imageUrl: card.imageUrl };

        try {
          const { url } = await generateImage({
            prompt: card.imagePrompt || `${card.name} tarot card, mystical art nouveau style`,
          });

          if (url) await updateCardImageUrl(card.id, url);
          return { imageUrl: url ?? null };
        } catch (error) {
          console.error("Image generation error:", error);
          throw new Error("Failed to generate card image");
        }
      }),
  }),
});

export type AppRouter = typeof appRouter;
