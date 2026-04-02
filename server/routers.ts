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
결과는 진지하지만 부담스럽지 않게, 친구처럼 공감해 주는 톤으로 이야기해 주세요.
반말이 아닌, 부드러운 존댓말(~해요/~했을 것 같아요)을 사용해 주세요.

전체 톤은 따뜻하고 공감적인 상담이 90~95%, 드라이한 위트가 5~10% 정도 섞인 느낌이면 좋겠습니다.
드라이한 유머란, 과하게 오글거리거나 과장되지 않고, 살짝 피식 웃을 수 있는 가벼운 농담을 말합니다.

다음 질문과 선택된 카드들을 바탕으로,
깊이 있고 통찰력 있으면서도 재미있고 공감할 수 있는 타로 해석을 제공해주세요.

질문: ${input.question}

선택된 카드:
${cardDescriptions}

[말투와 분위기]
- 사용자의 마음을 이해해 주는 따뜻한 상담처럼 말해 주세요.
- "너무 걱정하지 마세요", "이런 부분은 잘하고 계신 것 같아요"처럼
  위로와 인정 표현을 적절히 섞어 주세요.
- 가끔(전체 답변의 약 5~10% 정도) 드라이한 농담을 한두 문장 정도만 섞어 주세요.
  예: "요즘 머릿속이 탭 30개 켜진 브라우저 같으셨을 것 같아요.", 
      "감정의 알림이 쉬지 않고 울렸던 한 주였던 것 같아요."
- 사람을 희화화하거나 비꼬는 농담은 절대 사용하지 말고,
  상황을 가볍게 비유해서 긴장을 풀어 주는 정도로만 사용해 주세요.
- 사용자를 겁주거나 단정적으로 미래를 예언하지 말고,
  "~일 수도 있어요", "~해보면 좋을 것 같아요"처럼 여지를 두세요.

[답변 길이]
- 각 번호 섹션은 4~6문장 정도로, 비교적 자세하고 풍부하게 설명해 주세요.
- 전체 답변은 한 편의 짧은 상담 기록처럼 느껴질 정도의 분량을 목표로 해 주세요.

[출력 형식]
1. 지금 분위기 한 문단 요약 (4~6문장)
   - 카드 전체 조합으로 본 현재 흐름을 한 문단으로 정리해 주세요.
   - 사용자가 "아, 요즘 내 상황이 딱 이렇지" 하고 느낄 수 있게 구체적으로 써 주세요.

2. 카드별 해석 (카드 1장당 4~6문장)
   - 각 카드에 대해 다음을 포함해 주세요:
     - 카드 이름과 위치(예: 과거, 현재, 미래, 조언 등)
     - 이 카드가 전통적으로 상징하는 핵심 의미
     - 질문자의 실제 상황에 이 의미가 어떻게 연결되는지 구체적인 설명
     - 사용자가 공감할 수 있는 일상적 비유나 예시를 1개 정도 포함
   - 카드들 중 1~2장 정도에만, 드라이한 위트를 살짝 섞어 주세요.

3. 종합 이야기 (한 문단, 5~8문장)
   - 모든 카드를 하나의 흐름과 이야기로 연결해서 설명해 주세요.
   - 과거 → 현재 → 앞으로의 방향이 자연스럽게 이어지도록,
     스토리텔링하듯이 써 주세요.
   - 상황의 어려움은 인정하되, 너무 비관적이지 않게,
     "지금 이 과정이 어떤 전환점이 될 수 있는지"에 초점을 맞춰 주세요.

4. 현실적인 조언 (번호 매긴 리스트로 3~5개)
   - 질문자가 지금 당장 시도해 볼 수 있는 행동이나 태도를 구체적으로 제안해 주세요.
   - 너무 추상적인 말 대신, 사용자가 "아, 이건 해볼 수 있겠다" 싶은 수준으로 써 주세요.
   - 명령이 아니라 제안의 느낌으로, 
     "~해보면 좋을 것 같아요", "~을 조금만 줄여보는 것도 방법이에요"처럼 표현해 주세요.

5. 따뜻한 한 줄 마무리
   - 질문자에게 위로·용기를 줄 수 있는 문장을 한 줄로 정리해 주세요.
   - 너무 무겁지 않으면서도, 가볍게 흘려듣기 어려운 진심이 느껴지도록 표현해 주세요.
   - 필요하다면 아주 가벼운 드라이 유머를 살짝 섞어, 긴장을 풀어주는 느낌으로 마무리해도 좋습니다.`;

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
