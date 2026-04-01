import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Sparkles, Moon, Star } from "lucide-react";
import { Link } from "wouter";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden">
      {/* Starfield background effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-star-white"
            style={{
              width: Math.random() * 3 + 1 + "px",
              height: Math.random() * 3 + 1 + "px",
              left: Math.random() * 100 + "%",
              top: Math.random() * 100 + "%",
              opacity: Math.random() * 0.5 + 0.3,
              animation: `twinkle ${Math.random() * 3 + 2}s ease-in-out infinite`,
              animationDelay: Math.random() * 2 + "s",
            }}
          />
        ))}
      </div>

      <div className="container max-w-5xl relative z-10 px-6 py-16">
        {/* Hero Section */}
        <div className="text-center space-y-8 mb-16">
          <div className="inline-flex items-center gap-2 text-primary/80 mb-4">
            <Moon className="w-5 h-5" />
            <span className="text-sm font-display tracking-wider">MYSTIC TAROT</span>
            <Moon className="w-5 h-5" />
          </div>

          <h1 className="font-display text-5xl md:text-7xl font-bold text-gold-gradient mb-6 leading-tight">
            우주의 메시지를
            <br />
            받아보세요
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed font-serif-elegant">
            78장의 신비로운 타로카드가 당신의 과거, 현재, 미래를 비춥니다.
            <br />
            AI가 해석하는 깊이 있는 통찰을 경험해보세요.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-10">
            <Link href="/reading">
              <Button size="lg" className="glow-gold font-display text-lg px-8 py-6 h-auto">
                <Sparkles className="w-5 h-5 mr-2" />
                타로 리딩 시작하기
              </Button>
            </Link>
            <Link href="/history">
              <Button size="lg" variant="outline" className="font-display text-lg px-8 py-6 h-auto border-primary/30 hover:border-primary/60">
                <Star className="w-5 h-5 mr-2" />
                과거 리딩 보기
              </Button>
            </Link>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-3 gap-6 mt-20">
          <Card className="card-mystical p-6 text-center space-y-4">
            <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center glow-gold">
              <Sparkles className="w-8 h-8 text-primary" />
            </div>
            <h3 className="font-display text-xl font-semibold text-foreground">AI 타로 해석</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              선택한 카드와 질문을 바탕으로 AI가 개인화된 깊이 있는 해석을 제공합니다
            </p>
          </Card>

          <Card className="card-mystical p-6 text-center space-y-4">
            <div className="w-16 h-16 mx-auto rounded-full bg-mystic-purple/20 flex items-center justify-center glow-purple">
              <Moon className="w-8 h-8 text-mystic-purple" />
            </div>
            <h3 className="font-display text-xl font-semibold text-foreground">78장의 카드</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              메이저 아르카나와 마이너 아르카나 전체 덱으로 정확한 리딩을 제공합니다
            </p>
          </Card>

          <Card className="card-mystical p-6 text-center space-y-4">
            <div className="w-16 h-16 mx-auto rounded-full bg-accent/20 flex items-center justify-center">
              <Star className="w-8 h-8 text-accent-foreground" />
            </div>
            <h3 className="font-display text-xl font-semibold text-foreground">히스토리 저장</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              과거의 타로 리딩을 저장하고 언제든지 다시 확인할 수 있습니다
            </p>
          </Card>
        </div>

        {/* Ornamental Divider */}
        <div className="ornament-divider my-16">
          <span className="font-display text-sm">✦</span>
        </div>

        {/* How it works */}
        <div className="text-center space-y-6">
          <h2 className="font-display text-3xl font-semibold text-foreground">어떻게 시작하나요?</h2>
          <div className="grid md:grid-cols-3 gap-8 mt-8 text-left">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-display font-bold">
                1
              </div>
              <h4 className="font-display text-lg font-semibold">스프레드 선택</h4>
              <p className="text-muted-foreground text-sm">
                단일 카드, 3장 스프레드, 또는 켈틱 크로스 중 선택하세요
              </p>
            </div>
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-display font-bold">
                2
              </div>
              <h4 className="font-display text-lg font-semibold">질문 입력</h4>
              <p className="text-muted-foreground text-sm">
                타로에게 묻고 싶은 질문이나 고민을 입력하세요
              </p>
            </div>
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-display font-bold">
                3
              </div>
              <h4 className="font-display text-lg font-semibold">카드 선택</h4>
              <p className="text-muted-foreground text-sm">
                직관을 따라 카드를 선택하고 AI의 해석을 받아보세요
              </p>
            </div>
          </div>
        </div>

        {/* Footer CTA */}
        <div className="text-center mt-20">
          <Link href="/reading">
            <Button size="lg" variant="outline" className="font-display border-primary/40 hover:border-primary pulse-glow">
              지금 바로 시작하기 →
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
