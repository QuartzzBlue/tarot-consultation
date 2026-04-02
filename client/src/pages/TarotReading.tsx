import { useState, useMemo } from "react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Sparkles, ArrowLeft, ArrowRight, Shuffle, RotateCcw } from "lucide-react";
import { Link } from "wouter";
import type { TarotCard } from "../../../drizzle/schema";

type SpreadType = "single" | "three-card" | "celtic-cross";

const SPREAD_CONFIG: Record<SpreadType, { label: string; count: number; description: string; positions: string[] }> = {
  single: {
    label: "단일 카드",
    count: 1,
    description: "하나의 카드로 핵심 메시지를 받습니다",
    positions: ["현재"],
  },
  "three-card": {
    label: "3장 스프레드",
    count: 3,
    description: "과거, 현재, 미래의 흐름을 읽습니다",
    positions: ["과거", "현재", "미래"],
  },
  "celtic-cross": {
    label: "켈틱 크로스",
    count: 10,
    description: "상황의 모든 측면을 깊이 탐구합니다",
    positions: ["현재 상황", "도전", "과거", "미래", "의식", "잠재의식", "조언", "외부 영향", "희망과 두려움", "결과"],
  },
};

// Tarot card back design SVG pattern
function CardBack({ isSelected, selectionOrder, onClick, isShuffling }: { isSelected: boolean; selectionOrder?: number; onClick: () => void; isShuffling?: boolean }) {
  return (
    <div
      onClick={onClick}
      className={`relative cursor-pointer rounded-lg overflow-hidden transition-all duration-300 ${
        isSelected
          ? "ring-2 ring-primary glow-gold scale-105"
          : "hover:scale-105 hover:ring-1 hover:ring-primary/50"
      } ${isShuffling ? "animate-pulse" : ""}`}
      style={{ aspectRatio: "2/3" }}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-[oklch(0.15_0.08_290)] to-[oklch(0.08_0.04_280)]">
        {/* Card back pattern */}
        <svg viewBox="0 0 100 150" className="w-full h-full opacity-80">
          <defs>
            <pattern id="stars" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
              <polygon points="10,2 12,8 18,8 13,12 15,18 10,14 5,18 7,12 2,8 8,8" fill="none" stroke="oklch(0.78 0.14 75 / 0.3)" strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect width="100" height="150" fill="url(#stars)"/>
          <rect x="5" y="5" width="90" height="140" fill="none" stroke="oklch(0.78 0.14 75 / 0.5)" strokeWidth="1" rx="3"/>
          <rect x="8" y="8" width="84" height="134" fill="none" stroke="oklch(0.78 0.14 75 / 0.3)" strokeWidth="0.5" rx="2"/>
          <circle cx="50" cy="75" r="20" fill="none" stroke="oklch(0.78 0.14 75 / 0.6)" strokeWidth="1"/>
          <polygon points="50,58 54,68 65,68 56,75 59,86 50,79 41,86 44,75 35,68 46,68" fill="oklch(0.78 0.14 75 / 0.4)" stroke="oklch(0.78 0.14 75 / 0.6)" strokeWidth="0.5"/>
          <text x="50" y="130" textAnchor="middle" fill="oklch(0.78 0.14 75 / 0.5)" fontSize="6" fontFamily="serif">✦ MYSTIC TAROT ✦</text>
        </svg>
      </div>
      {isSelected && selectionOrder !== undefined && (
        <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
          <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-display font-bold text-lg">{selectionOrder}</span>
          </div>
        </div>
      )}
    </div>
  );
}

// Card front display
function CardFront({ card, isReversed }: { card: TarotCard; isReversed: boolean }) {
  return (
    <div
      className={`relative rounded-lg overflow-hidden border border-primary/30 ${isReversed ? "rotate-180" : ""}`}
      style={{ aspectRatio: "2/3" }}
    >
      {card.imageUrl ? (
        <img src={card.imageUrl} alt={card.nameKo} className="w-full h-full object-cover" />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-b from-[oklch(0.15_0.08_290)] to-[oklch(0.08_0.04_280)] flex flex-col items-center justify-center p-3">
          <div className="text-primary/60 text-2xl mb-2">✦</div>
          <p className="text-primary font-display text-xs text-center leading-tight">{card.nameKo}</p>
          <p className="text-muted-foreground text-xs text-center mt-1 opacity-70">{card.name}</p>
        </div>
      )}
    </div>
  );
}

// Card flip animation component
function FlipCard({ card, isReversed, isFlipped, onFlipComplete }: { card: TarotCard; isReversed: boolean; isFlipped: boolean; onFlipComplete?: () => void }) {
  return (
    <div
      className="relative cursor-pointer"
      style={{
        aspectRatio: "2/3",
        perspective: "1000px",
      }}
      onClick={onFlipComplete}
    >
      <div
        className="relative w-full h-full transition-transform duration-700"
        style={{
          transformStyle: "preserve-3d",
          transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
        }}
      >
        {/* Card back */}
        <div
          className="absolute w-full h-full rounded-lg overflow-hidden bg-gradient-to-b from-[oklch(0.15_0.08_290)] to-[oklch(0.08_0.04_280)]"
          style={{ backfaceVisibility: "hidden" }}
        >
          <svg viewBox="0 0 100 150" className="w-full h-full opacity-80">
            <defs>
              <pattern id="stars-flip" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                <polygon points="10,2 12,8 18,8 13,12 15,18 10,14 5,18 7,12 2,8 8,8" fill="none" stroke="oklch(0.78 0.14 75 / 0.3)" strokeWidth="0.5"/>
              </pattern>
            </defs>
            <rect width="100" height="150" fill="url(#stars-flip)"/>
            <rect x="5" y="5" width="90" height="140" fill="none" stroke="oklch(0.78 0.14 75 / 0.5)" strokeWidth="1" rx="3"/>
            <circle cx="50" cy="75" r="20" fill="none" stroke="oklch(0.78 0.14 75 / 0.6)" strokeWidth="1"/>
            <polygon points="50,58 54,68 65,68 56,75 59,86 50,79 41,86 44,75 35,68 46,68" fill="oklch(0.78 0.14 75 / 0.4)" stroke="oklch(0.78 0.14 75 / 0.6)" strokeWidth="0.5"/>
          </svg>
        </div>

        {/* Card front */}
        <div
          className="absolute w-full h-full rounded-lg overflow-hidden border border-primary/30"
          style={{
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
          }}
        >
          {card.imageUrl ? (
            <img src={card.imageUrl} alt={card.nameKo} className={`w-full h-full object-cover ${isReversed ? "rotate-180" : ""}`} />
          ) : (
            <div className={`absolute inset-0 bg-gradient-to-b from-[oklch(0.15_0.08_290)] to-[oklch(0.08_0.04_280)] flex flex-col items-center justify-center p-3 ${isReversed ? "rotate-180" : ""}`}>
              <div className="text-primary/60 text-2xl mb-2">✦</div>
              <p className="text-primary font-display text-xs text-center leading-tight">{card.nameKo}</p>
              <p className="text-muted-foreground text-xs text-center mt-1 opacity-70">{card.name}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function TarotReading() {
  const [, navigate] = useLocation();
  const [step, setStep] = useState<"spread" | "question" | "cards" | "confirm" | "loading">("spread");
  const [spreadType, setSpreadType] = useState<SpreadType>("three-card");
  const [question, setQuestion] = useState("");
  const [selectedIndices, setSelectedIndices] = useState<number[]>([]);
  const [reversedStates, setReversedStates] = useState<boolean[]>([]);
  const [shuffledOrder, setShuffledOrder] = useState<number[]>([]);
  const [isShuffling, setIsShuffling] = useState(false);
  const [flippedCards, setFlippedCards] = useState<Set<number>>(new Set());

  const { data: allCards, isLoading: cardsLoading } = trpc.tarot.getAllCards.useQuery();
  const createReading = trpc.tarot.createReading.useMutation();

  const spread = SPREAD_CONFIG[spreadType];

  // Create shuffled deck order
  const shuffledDeck = useMemo(() => {
    if (!allCards) return [];
    const indices = allCards.map((_, i) => i);
    // Fisher-Yates shuffle based on shuffledOrder seed
    const shuffled = [...indices];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }, [allCards, shuffledOrder]);

  const handleShuffle = async () => {
    setIsShuffling(true);
    // Simulate shuffling animation
    await new Promise(resolve => setTimeout(resolve, 1200));
    setShuffledOrder(prev => [...prev, Date.now()]);
    setSelectedIndices([]);
    setReversedStates([]);
    setFlippedCards(new Set());
    setIsShuffling(false);
  };

  const handleCardSelect = (deckIndex: number) => {
    if (selectedIndices.includes(deckIndex)) {
      const pos = selectedIndices.indexOf(deckIndex);
      setSelectedIndices(prev => prev.filter(i => i !== deckIndex));
      setReversedStates(prev => prev.filter((_, i) => i !== pos));
    } else if (selectedIndices.length < spread.count) {
      setSelectedIndices(prev => [...prev, deckIndex]);
      setReversedStates(prev => [...prev, Math.random() < 0.3]); // 30% chance reversed
    }
  };

  const handleFlipCard = (index: number) => {
    setFlippedCards(prev => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  const handleSubmit = async () => {
    if (!allCards) return;
    if (selectedIndices.length !== spread.count) {
      toast.error(`${spread.count}장의 카드를 선택해주세요`);
      return;
    }

    setStep("loading");
    try {
      const selectedCardIds = selectedIndices.map(idx => allCards[shuffledDeck[idx]].id);
      const result = await createReading.mutateAsync({
        question,
        spreadType,
        selectedCardIds,
        reversedStates,
      });

      // Save to localStorage for anonymous users
      const stored = JSON.parse(localStorage.getItem("tarot_readings") || "[]");
      stored.unshift(result.readingId);
      localStorage.setItem("tarot_readings", JSON.stringify(stored.slice(0, 50)));

      navigate(`/reading/${result.readingId}`);
    } catch (error) {
      toast.error("리딩 생성 중 오류가 발생했습니다");
      setStep("confirm");
    }
  };

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="border-b border-border/50 px-6 py-4 flex items-center justify-between">
        <Link href="/">
          <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
            <ArrowLeft className="w-4 h-4 mr-2" />
            홈으로
          </Button>
        </Link>
        <span className="font-display text-primary text-sm tracking-wider">MYSTIC TAROT</span>
        <div className="w-24" />
      </nav>

      <div className="container max-w-5xl py-10">
        {/* Progress indicator */}
        <div className="flex items-center justify-center gap-2 mb-10">
          {["spread", "question", "cards", "confirm"].map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-display font-bold transition-all ${
                step === s ? "bg-primary text-primary-foreground glow-gold" :
                ["spread", "question", "cards", "confirm"].indexOf(step) > i ? "bg-primary/30 text-primary" :
                "bg-muted text-muted-foreground"
              }`}>
                {i + 1}
              </div>
              {i < 3 && <div className="w-12 h-px bg-border" />}
            </div>
          ))}
        </div>

        {/* Step 1: Spread Selection */}
        {step === "spread" && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
            <div className="text-center">
              <h1 className="font-display text-4xl font-bold text-foreground mb-3">스프레드 선택</h1>
              <p className="text-muted-foreground">어떤 방식으로 타로를 읽을까요?</p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {(Object.entries(SPREAD_CONFIG) as [SpreadType, typeof SPREAD_CONFIG[SpreadType]][]).map(([type, config]) => (
                <Card
                  key={type}
                  onClick={() => setSpreadType(type)}
                  className={`card-mystical p-6 cursor-pointer transition-all ${
                    spreadType === type ? "ring-2 ring-primary glow-gold" : ""
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="font-display text-lg font-semibold">{config.label}</h3>
                      <Badge variant={spreadType === type ? "default" : "secondary"} className="font-display">
                        {config.count}장
                      </Badge>
                    </div>
                    <p className="text-muted-foreground text-sm">{config.description}</p>
                    <div className="flex gap-1 flex-wrap mt-3">
                      {config.positions.map(pos => (
                        <span key={pos} className="text-xs text-primary/70 bg-primary/10 px-2 py-0.5 rounded-full">
                          {pos}
                        </span>
                      ))}
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            <div className="flex justify-end">
              <Button onClick={() => setStep("question")} className="font-display px-8">
                다음 단계
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        )}

        {/* Step 2: Question Input */}
        {step === "question" && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 max-w-2xl mx-auto">
            <div className="text-center">
              <h1 className="font-display text-4xl font-bold text-foreground mb-3">질문 입력</h1>
              <p className="text-muted-foreground">타로에게 묻고 싶은 것을 자유롭게 적어주세요</p>
            </div>

            <div className="border-mystic rounded-xl p-6 space-y-4">
              <div className="ornament-divider">
                <span className="text-xs font-display text-primary/60">당신의 질문</span>
              </div>
              <Textarea
                value={question}
                onChange={e => setQuestion(e.target.value)}
                placeholder="예: 지금 제 연애 상황은 어떻게 흘러갈까요? / 새로운 직장으로 이직해야 할까요? / 현재 제 삶에서 가장 중요한 것은 무엇인가요?"
                className="min-h-36 bg-transparent border-border/50 text-foreground placeholder:text-muted-foreground/50 resize-none font-serif-elegant text-base leading-relaxed"
              />
              <div className="text-xs text-muted-foreground text-right">{question.length}/500</div>
            </div>

            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setStep("spread")} className="font-display">
                <ArrowLeft className="w-4 h-4 mr-2" />
                이전
              </Button>
              <Button
                onClick={() => setStep("cards")}
                disabled={!question.trim()}
                className="font-display px-8"
              >
                카드 선택하기
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        )}

        {/* Step 3: Card Selection */}
        {step === "cards" && !cardsLoading && allCards && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
            <div className="text-center">
              <h1 className="font-display text-4xl font-bold text-foreground mb-3">카드 선택</h1>
              <p className="text-muted-foreground">
                직관을 따라 {spread.count}장의 카드를 선택해주세요({selectedIndices.length}/{spread.count})
              </p>
            </div>

            <div className="flex justify-center">
              <Button
                onClick={handleShuffle}
                disabled={isShuffling}
                variant="outline"
                className="font-display gap-2"
              >
                <Shuffle className={`w-4 h-4 ${isShuffling ? "animate-spin" : ""}`} />
                {isShuffling ? "섞는 중..." : "덱 섞기"}
              </Button>
            </div>

            <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 gap-2">
              {shuffledDeck.map((cardIdx, deckPos) => {
                const isSelected = selectedIndices.includes(deckPos);
                const selectionOrder = isSelected ? selectedIndices.indexOf(deckPos) + 1 : undefined;
                return (
                  <div
                    key={deckPos}
                    className={`transition-all ${isSelected ? "scale-110 z-10" : ""}`}
                  >
                    <CardBack
                      isSelected={isSelected}
                      selectionOrder={selectionOrder}
                      onClick={() => handleCardSelect(deckPos)}
                      isShuffling={isShuffling}
                    />
                  </div>
                );
              })}
            </div>

            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setStep("question")} className="font-display">
                <ArrowLeft className="w-4 h-4 mr-2" />
                이전
              </Button>
              <Button
                onClick={() => setStep("confirm")}
                disabled={selectedIndices.length !== spread.count}
                className="font-display px-8"
              >
                다음 단계
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        )}

        {/* Step 4: Card Confirmation with Flip Animation */}
        {step === "confirm" && !cardsLoading && allCards && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
            <div className="text-center">
              <h1 className="font-display text-4xl font-bold text-foreground mb-3">선택된 카드</h1>
              <p className="text-muted-foreground">카드를 클릭하여 뒤집어보세요</p>
            </div>

            <div className="grid gap-8 max-w-4xl mx-auto">
              {selectedIndices.map((deckPos, idx) => {
                const cardIdx = shuffledDeck[deckPos];
                const card = allCards[cardIdx];
                const isReversed = reversedStates[idx];
                const isFlipped = flippedCards.has(idx);

                return (
                  <div key={idx} className="space-y-3">
                    <div className="text-center">
                      <Badge variant="secondary" className="font-display">
                        {spread.positions[idx]}
                      </Badge>
                    </div>
                    <div className="flex justify-center">
                      <div className="w-32 sm:w-40">
                        <FlipCard
                          card={card}
                          isReversed={isReversed}
                          isFlipped={isFlipped}
                          onFlipComplete={() => handleFlipCard(idx)}
                        />
                      </div>
                    </div>
                    {isFlipped && (
                      <div className="text-center space-y-1 animate-in fade-in">
                        <p className="font-display text-lg text-primary">{card.nameKo}</p>
                        <p className="text-sm text-muted-foreground">{isReversed ? "역방향" : "정방향"}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setStep("cards")} className="font-display">
                <ArrowLeft className="w-4 h-4 mr-2" />
                카드 다시 선택
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={createReading.isPending}
                className="font-display px-8 glow-gold"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                {createReading.isPending ? "리딩 생성 중..." : "리딩 받기"}
              </Button>
            </div>
          </div>
        )}

        {/* Loading state */}
        {step === "loading" && (
          <div className="flex flex-col items-center justify-center py-20 space-y-6">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center animate-pulse">
              <Sparkles className="w-8 h-8 text-primary animate-spin" />
            </div>
            <div className="text-center space-y-2">
              <p className="font-display text-lg text-foreground">타로의 메시지를 해석 중...</p>
              <p className="text-muted-foreground text-sm">잠시만 기다려주세요</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
