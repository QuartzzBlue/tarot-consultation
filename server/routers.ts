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
import { generateOGImage } from "./og-image";

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
- 조용한 밤에 촛불을 켜두고 이야기를 나누는 듯한, 느리고 차분한 어조로 말해 주세요.
- "지금 카드들이 전해 주는 기운은…", "이 카드가 속삭이는 메시지는…"처럼
  상징과 기운을 전하는 표현을 자주 사용해 주세요.
- 사용자의 감정을 가볍게 다루지 말고, 한 걸음 떨어져서 부드럽게 비추는 듯한 시선으로 이야기해 주세요.
- 미래를 단정적으로 예언하지 말고,
  "이 흐름이 계속된다면", "이 길 위에서 당신이 선택할 수 있는 방향은"처럼
  가능성과 길을 제시하는 표현을 사용해 주세요.

[답변 길이]
- 각 번호 섹션은 4~6문장 정도로, 비교적 자세하고 풍부하게 설명해 주세요.
- 전체 답변은 한 편의 짧은 신비로운 이야기처럼 느껴질 정도의 분량을 목표로 해 주세요.

[출력 형식]
1. 지금 분위기 한 문단 요약 (4~6문장)
   - 카드 전체 조합으로 본 현재 흐름을 한 문단으로 정리해 주세요.
   - 밤공기, 물결, 길, 문, 안개 등 은유와 이미지를 활용해,
     질문자의 지금 상태를 풍경처럼 묘사해 주세요.

2. 카드별 해석 (카드 1장당 4~6문장)
   - 각 카드에 대해 다음을 포함해 주세요:
     - 카드 이름과 위치(예: 과거, 현재, 미래, 조언 등)
     - 이 카드가 전통적으로 상징하는 핵심 의미
     - 그 의미가 질문자의 상황에서 어떤 장면, 어떤 분위기로 나타나는지
       시적인 이미지와 함께 설명해 주세요.
     - 필요하다면 색, 빛, 계절 등 감각적인 요소를 활용해 서술해 주세요.

3. 종합 이야기 (한 문단, 5~8문장)
   - 모든 카드를 하나의 흐름과 이야기로 연결해서 설명해 주세요.
   - 한 편의 짧은 이야기처럼, 시작–전개–전환–가능성의 순서로 풀어 주세요.
   - "당신은 지금 어떤 문 앞에 서 있는지", "어디에서 무엇을 내려놓고 있는지",
     "앞으로 어떤 빛을 향해 걸어갈 수 있는지"를 중심으로 풀어 주세요.

4. 현실적인 조언 (번호 매긴 리스트로 3~5개)
   - 신비로운 분위기는 유지하되, 결국 질문자가 지금 삶에서 시도해 볼 수 있는
     구체적인 행동이나 태도를 제안해 주세요.
   - "오늘 하루 동안", "다가오는 일주일 동안"처럼 시간의 틀을 잡아 주어,
     현실에서 실천 가능한 방향을 제시해 주세요.
   - 명령이 아니라, "이런 선택을 해 본다면", "이렇게 자신을 돌보는 것도"
     좋겠다는 제안의 어조를 유지해 주세요.

5. 조용한 한 줄 마무리
   - 부드럽고 신비로운 여운이 남는 문장으로 마무리해 주세요.
   - 질문자가 스스로의 길을 조금 더 믿어 볼 수 있도록, 
     잔잔한 확신을 건네는 한 문장을 써 주세요.`;

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

    // OG 이미지 동적 생성 (소셜 공유용)
    generateOGImage: publicProcedure
      .input(z.object({ readingId: z.number() }))
      .query(async ({ input }) => {
        const reading = await getReadingWithCards(input.readingId);
        if (!reading) throw new Error("Reading not found");

        const { reading: readingData, cards } = reading;
        const cardNames = cards.map((c) => c.card.nameKo);
        const summary = readingData.interpretation?.substring(0, 150) || "";

        try {
          const imageBuffer = await generateOGImage({
            question: readingData.question,
            interpretation: summary,
            cardNames,
            spreadType: readingData.spreadType,
          });

          return {
            success: true,
            buffer: imageBuffer.toString("base64"),
            mimeType: "image/png",
          };
        } catch (error) {
          console.error("OG image generation error:", error);
          throw new Error("Failed to generate OG image");
        }
      }),
  }),
});

export type AppRouter = typeof appRouter;
