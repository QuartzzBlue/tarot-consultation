import { useState, useEffect } from "react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Sparkles, Clock, BookOpen, LogIn } from "lucide-react";
import { getLoginUrl } from "@/const";
import type { Reading } from "../../../drizzle/schema";

function ReadingCard({ reading }: { reading: Reading }) {
  const spreadLabel: Record<string, string> = {
    single: "단일 카드",
    "three-card": "3장 스프레드",
    "celtic-cross": "켈틱 크로스",
  };

  return (
    <Link href={`/reading/${reading.id}`}>
      <Card className="card-mystical p-5 cursor-pointer group">
        <div className="space-y-3">
          <div className="flex items-start justify-between gap-3">
            <p className="font-serif-elegant text-foreground/90 text-sm leading-relaxed line-clamp-2 flex-1">
              "{reading.question}"
            </p>
            <Badge variant="secondary" className="font-display text-xs shrink-0">
              {spreadLabel[reading.spreadType] || reading.spreadType}
            </Badge>
          </div>

          {reading.interpretation && (
            <p className="text-muted-foreground text-xs leading-relaxed line-clamp-3">
              {reading.interpretation.replace(/[#*`]/g, "").substring(0, 150)}...
            </p>
          )}

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-muted-foreground text-xs">
              <Clock className="w-3 h-3" />
              <span>
                {new Date(reading.createdAt).toLocaleDateString("ko-KR", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>
            <span className="text-primary text-xs font-display opacity-0 group-hover:opacity-100 transition-opacity">
              자세히 보기 →
            </span>
          </div>
        </div>
      </Card>
    </Link>
  );
}

export default function History() {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const [localReadingIds, setLocalReadingIds] = useState<number[]>([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("tarot_readings") || "[]");
    setLocalReadingIds(stored);
  }, []);

  const { data: userReadings, isLoading: userReadingsLoading } = trpc.tarot.getMyReadings.useQuery(
    undefined,
    { enabled: isAuthenticated }
  );

  const { data: anonymousReadings, isLoading: anonLoading } = trpc.tarot.getAnonymousReadings.useQuery(
    { readingIds: localReadingIds },
    { enabled: !isAuthenticated && localReadingIds.length > 0 }
  );

  const readings = isAuthenticated ? userReadings : anonymousReadings;
  const isLoading = authLoading || userReadingsLoading || anonLoading;

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
        {!isAuthenticated && !authLoading && (
          <a href={getLoginUrl()}>
            <Button size="sm" variant="outline" className="font-display border-primary/30 text-xs">
              <LogIn className="w-3 h-3 mr-1.5" />
              로그인
            </Button>
          </a>
        )}
        {isAuthenticated && (
          <div className="text-xs text-muted-foreground font-display">{user?.name}</div>
        )}
      </nav>

      <div className="container max-w-4xl py-10 space-y-8">
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 text-primary/70">
            <BookOpen className="w-4 h-4" />
            <span className="text-sm font-display tracking-wider">리딩 히스토리</span>
          </div>
          <h1 className="font-display text-4xl font-bold text-foreground">과거의 메시지</h1>
          <p className="text-muted-foreground">
            {isAuthenticated
              ? `${user?.name}님의 타로 리딩 기록입니다`
              : "로그인하면 모든 기기에서 리딩 기록을 확인할 수 있습니다"}
          </p>
        </div>

        {/* Login prompt for anonymous users */}
        {!isAuthenticated && !authLoading && (
          <Card className="border-mystic p-6 text-center space-y-4">
            <div className="w-12 h-12 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
              <LogIn className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="font-display text-lg font-semibold mb-2">로그인하여 더 많은 기능을 사용하세요</h3>
              <p className="text-muted-foreground text-sm">
                로그인하면 리딩 기록이 영구적으로 저장되고, 모든 기기에서 확인할 수 있습니다
              </p>
            </div>
            <a href={getLoginUrl()}>
              <Button className="font-display glow-gold">
                <LogIn className="w-4 h-4 mr-2" />
                로그인하기
              </Button>
            </a>
          </Card>
        )}

        {/* Readings List */}
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-32 rounded-xl" />
            ))}
          </div>
        ) : readings && readings.length > 0 ? (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground font-display">
              총 {readings.length}개의 리딩
            </p>
            {readings.map(reading => (
              <ReadingCard key={reading.id} reading={reading} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 space-y-6">
            <div className="w-20 h-20 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
              <Sparkles className="w-10 h-10 text-primary/50" />
            </div>
            <div className="space-y-2">
              <h3 className="font-display text-xl font-semibold text-foreground">아직 리딩 기록이 없습니다</h3>
              <p className="text-muted-foreground text-sm">
                첫 번째 타로 리딩을 시작해보세요
              </p>
            </div>
            <Link href="/reading">
              <Button className="font-display glow-gold">
                <Sparkles className="w-4 h-4 mr-2" />
                타로 리딩 시작하기
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
