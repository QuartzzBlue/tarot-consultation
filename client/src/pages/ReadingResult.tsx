import { useState } from "react";
import { useParams, Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { ArrowLeft, Sparkles, ImageIcon, RotateCcw, Share2 } from "lucide-react";
import { Streamdown } from "streamdown";

function CardImageDisplay({
  cardId,
  cardName,
  cardNameKo,
  imageUrl,
  isReversed,
}: {
  cardId: number;
  cardName: string;
  cardNameKo: string;
  imageUrl: string | null;
  isReversed: boolean;
}) {
  const [localImageUrl, setLocalImageUrl] = useState(imageUrl);
  const [isGenerating, setIsGenerating] = useState(false);
  const generateImage = trpc.tarot.generateCardImage.useMutation();

  const handleGenerateImage = async () => {
    setIsGenerating(true);
    try {
      const result = await generateImage.mutateAsync({ cardId });
      if (result.imageUrl) {
        setLocalImageUrl(result.imageUrl);
        toast.success("카드 이미지가 생성되었습니다!");
      }
    } catch {
      toast.error("이미지 생성에 실패했습니다");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className={`relative rounded-xl overflow-hidden border border-primary/30 ${isReversed ? "rotate-180" : ""}`}
      style={{ aspectRatio: "2/3" }}>
      {localImageUrl ? (
        <img src={localImageUrl} alt={cardNameKo} className="w-full h-full object-cover" />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-b from-[oklch(0.15_0.08_290)] to-[oklch(0.08_0.04_280)] flex flex-col items-center justify-center p-4 gap-3">
          <div className="text-primary/60 text-3xl">✦</div>
          <p className="text-primary font-display text-sm text-center">{cardNameKo}</p>
          <p className="text-muted-foreground text-xs text-center opacity-70">{cardName}</p>
          {!isGenerating ? (
            <Button
              size="sm"
              variant="outline"
              onClick={handleGenerateImage}
              className="text-xs border-primary/30 hover:border-primary mt-2"
              style={{ transform: isReversed ? "rotate(180deg)" : "none" }}
            >
              <ImageIcon className="w-3 h-3 mr-1" />
              이미지 생성
            </Button>
          ) : (
            <div className="flex items-center gap-2 text-xs text-primary">
              <div className="w-4 h-4 border border-primary/50 border-t-primary rounded-full animate-spin" />
              생성 중...
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function ReadingResult() {
  const { id } = useParams<{ id: string }>();
  const readingId = parseInt(id || "0");

  const { data, isLoading, error } = trpc.tarot.getReading.useQuery(
    { readingId },
    { enabled: !!readingId }
  );

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast.success("링크가 복사되었습니다!");
    } catch {
      toast.error("링크 복사에 실패했습니다");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <nav className="border-b border-border/50 px-6 py-4 flex items-center justify-between">
          <Link href="/reading">
            <Button variant="ghost" size="sm" className="text-muted-foreground">
              <ArrowLeft className="w-4 h-4 mr-2" />
              새 리딩
            </Button>
          </Link>
          <span className="font-display text-primary text-sm tracking-wider">MYSTIC TAROT</span>
          <div className="w-24" />
        </nav>
        <div className="container max-w-5xl py-10 space-y-8">
          <Skeleton className="h-12 w-64 mx-auto" />
          <div className="grid md:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-64 rounded-xl" />
            ))}
          </div>
          <Skeleton className="h-96 rounded-xl" />
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-muted-foreground">리딩을 찾을 수 없습니다</p>
          <Link href="/reading">
            <Button className="font-display">새 리딩 시작하기</Button>
          </Link>
        </div>
      </div>
    );
  }

  const { reading, cards } = data;

  const spreadPositionNames: Record<string, string[]> = {
    single: ["현재"],
    "three-card": ["과거", "현재", "미래"],
    "celtic-cross": ["현재 상황", "도전", "과거", "미래", "의식", "잠재의식", "조언", "외부 영향", "희망과 두려움", "결과"],
  };

  const positions = spreadPositionNames[reading.spreadType] || [];

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="border-b border-border/50 px-6 py-4 flex items-center justify-between">
        <Link href="/reading">
          <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
            <ArrowLeft className="w-4 h-4 mr-2" />
            새 리딩
          </Button>
        </Link>
        <span className="font-display text-primary text-sm tracking-wider">MYSTIC TAROT</span>
        <Button variant="ghost" size="sm" onClick={handleShare} className="text-muted-foreground hover:text-foreground">
          <Share2 className="w-4 h-4 mr-2" />
          공유
        </Button>
      </nav>

      <div className="container max-w-5xl py-10 space-y-12">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 text-primary/70">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-display tracking-wider">타로 리딩 결과</span>
            <Sparkles className="w-4 h-4" />
          </div>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground">
            "{reading.question}"
          </h1>
          <div className="flex items-center justify-center gap-3">
            <Badge variant="secondary" className="font-display">
              {reading.spreadType === "single" ? "단일 카드" :
               reading.spreadType === "three-card" ? "3장 스프레드" : "켈틱 크로스"}
            </Badge>
            <span className="text-muted-foreground text-sm">
              {new Date(reading.createdAt).toLocaleDateString("ko-KR", {
                year: "numeric", month: "long", day: "numeric",
              })}
            </span>
          </div>
        </div>

        {/* Cards Display */}
        <div>
          <div className="ornament-divider mb-8">
            <span className="font-display text-sm text-primary/60">선택된 카드</span>
          </div>

          <div className={`grid gap-6 ${
            cards.length === 1 ? "max-w-xs mx-auto" :
            cards.length <= 3 ? `grid-cols-${cards.length} max-w-2xl mx-auto` :
            "grid-cols-2 sm:grid-cols-3 md:grid-cols-5"
          }`}>
            {cards.map(({ readingCard, card }, idx) => (
              <div key={readingCard.id} className="space-y-3 text-center">
                <div className="relative">
                  <CardImageDisplay
                    cardId={card.id}
                    cardName={card.name}
                    cardNameKo={card.nameKo}
                    imageUrl={card.imageUrl}
                    isReversed={readingCard.isReversed}
                  />
                </div>
                <div className="space-y-1">
                  <p className="font-display text-sm font-semibold text-primary">
                    {positions[idx] || `위치 ${idx + 1}`}
                  </p>
                  <p className="text-foreground text-sm font-medium">{card.nameKo}</p>
                  <p className="text-muted-foreground text-xs">{card.name}</p>
                  {readingCard.isReversed && (
                    <Badge variant="outline" className="text-xs border-primary/30">
                      <RotateCcw className="w-2 h-2 mr-1" />
                      역방향
                    </Badge>
                  )}
                </div>
                <div className="text-xs text-muted-foreground bg-muted/30 rounded-lg p-2 text-left">
                  <p className="font-semibold text-primary/80 mb-1">
                    {readingCard.isReversed ? "역방향 의미" : "정방향 의미"}
                  </p>
                  <p className="leading-relaxed">
                    {readingCard.isReversed ? card.reversedMeaning : card.uprightMeaning}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Card Keywords */}
        <div className="flex flex-wrap gap-2 justify-center">
          {cards.flatMap(({ card }) =>
            (card.keywords as string[]).map((kw, i) => (
              <Badge key={`${card.id}-${i}`} variant="outline" className="border-primary/20 text-primary/70 font-serif-elegant">
                {kw}
              </Badge>
            ))
          )}
        </div>

        {/* AI Interpretation */}
        {reading.interpretation && (
          <Card className="card-mystical p-8 space-y-6">
            <div className="ornament-divider">
              <span className="font-display text-sm text-primary/60">✦ AI 타로 해석 ✦</span>
            </div>

            <div className="prose prose-invert max-w-none font-serif-elegant text-foreground/90 leading-relaxed">
              <Streamdown>{reading.interpretation}</Streamdown>
            </div>
          </Card>
        )}

        {/* Individual Card Details */}
        <div className="space-y-6">
          <div className="ornament-divider">
            <span className="font-display text-sm text-primary/60">카드 상세 정보</span>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {cards.map(({ readingCard, card }, idx) => (
              <Card key={readingCard.id} className="card-mystical p-5 space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs text-primary/60 font-display mb-1">{positions[idx] || `위치 ${idx + 1}`}</p>
                    <h3 className="font-display text-lg font-semibold text-foreground">{card.nameKo}</h3>
                    <p className="text-muted-foreground text-sm">{card.name}</p>
                  </div>
                  <div className="flex flex-col gap-1 items-end">
                    <Badge variant="secondary" className="text-xs">
                      {card.arcana === "major" ? "메이저" : "마이너"} 아르카나
                    </Badge>
                    {card.suit && (
                      <Badge variant="outline" className="text-xs border-primary/20">
                        {card.suit === "wands" ? "완드" :
                         card.suit === "cups" ? "컵" :
                         card.suit === "swords" ? "소드" : "펜타클"}
                      </Badge>
                    )}
                  </div>
                </div>

                <p className="text-sm text-muted-foreground leading-relaxed">{card.description}</p>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="bg-primary/5 rounded-lg p-3">
                    <p className="text-primary/70 font-display mb-1">정방향</p>
                    <p className="text-foreground/80">{card.uprightMeaning}</p>
                  </div>
                  <div className="bg-muted/30 rounded-lg p-3">
                    <p className="text-muted-foreground font-display mb-1">역방향</p>
                    <p className="text-foreground/80">{card.reversedMeaning}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          <Link href="/reading">
            <Button className="font-display glow-gold px-8">
              <Sparkles className="w-4 h-4 mr-2" />
              새 리딩 시작하기
            </Button>
          </Link>
          <Link href="/history">
            <Button variant="outline" className="font-display border-primary/30 px-8">
              히스토리 보기
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
