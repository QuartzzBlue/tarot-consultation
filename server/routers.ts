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

        const llmPrompt = `당신은 한국인 사용자를 위한 전문 타로 리더입니다.
현실과 보이지 않는 세계 사이를 잔잔하게 연결해 주는, 신비롭고 차분한 안내자처럼 이야기해 주세요.

전체 톤은 차분하고 몽환적이며, 약간은 신비로운 여운이 남는 느낌이면 좋겠습니다.
일상적인 농담이나 가벼운 위트는 사용하지 말고, 상징과 이미지, 분위기를 섬세하게 묘사해 주세요.

다음 질문과 선택된 카드들을 바탕으로,
깊이 있고 통찰력 있으면서도 신비로운 분위기가 느껴지는 타로 해석을 제공해주세요.

질문: ${input.question}

선택된 카드:
${cardDescriptions}

[말투와 분위기]
- 현실과 영적 세계를 잇는 중개자처럼, 차분하고 신비로운 톤을 유지해 주세요.
- 사용자의 상황을 깊이 있게 이해하고, 그 안에 숨겨진 의미를 찾아내는 느낌으로 표현해 주세요.
- 단정적이지 않고, "~일 수도 있어요", "~의 신호로 보여요"처럼 여지를 두되,
  그 여지 속에 깊은 통찰력이 느껴지도록 써 주세요.
- 상징과 이미지를 풍부하게 사용하여, 읽는 사람이 명상하듯 빠져들 수 있게 표현해 주세요.
- 너무 학술적이거나 딱딱하지 않으면서도, 진정성 있고 깊이 있는 톤을 유지해 주세요.

[답변 길이]
- 각 섹션은 자세하고 풍부하게, 마치 한 편의 시적 상담처럼 느껴질 정도로 써 주세요.
- 전체 답변은 깊이 있는 명상적 경험을 제공할 정도의 분량을 목표로 해 주세요.

[출력 형식]
1. 지금 분위기 한 문단 요약 (5~7문장)
   - 카드 전체 조합으로 본 현재의 에너지와 흐름을 시적으로 표현해 주세요.
   - 사용자가 "아, 이게 지금 내 상황이구나"라고 느낄 수 있게 구체적이면서도 신비로운 표현으로 써 주세요.

2. 카드별 해석 (카드 1장당 5~7문장)
   - 각 카드에 대해 다음을 포함해 주세요:
     - 카드 이름과 위치(예: 과거, 현재, 미래, 조언 등)
     - 이 카드가 전통적으로 상징하는 핵심 의미
     - 질문자의 상황에 이 의미가 어떻게 연결되는지 깊이 있게 설명
     - 상징적이고 이미지적인 표현으로, 사용자가 공감할 수 있는 방식으로 표현
   - 각 카드마다 그 카드만의 독특한 에너지와 메시지를 느낄 수 있게 써 주세요.

3. 종합 이야기 (한 문단, 6~9문장)
   - 모든 카드를 하나의 흐름과 이야기로 연결해서 설명해 주세요.
   - 과거 → 현재 → 앞으로의 방향이 자연스럽게 이어지도록, 마치 한 편의 이야기를 읽는 듯이 써 주세요.
   - 상황의 어려움은 인정하되, 그 안에서 발견할 수 있는 의미와 성장의 가능성에 초점을 맞춰 주세요.

4. 현실적인 조언 (번호 매긴 리스트로 3~5개)
   - 질문자가 지금 당장 실천할 수 있는 행동이나 태도를 제안해 주세요.
   - 추상적이지 않으면서도, 신비로운 분위기를 잃지 않는 표현으로 써 주세요.
   - 명령이 아니라 제안의 느낌으로, "~을 시도해 보는 것도 좋을 것 같아요"처럼 표현해 주세요.

5. 따뜻한 한 줄 마무리
   - 질문자에게 용기와 희망을 전할 수 있는 문장을 한 줄로 정리해 주세요.
   - 신비로운 분위기를 유지하면서도, 진심이 느껴지도록 표현해 주세요.`;

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
