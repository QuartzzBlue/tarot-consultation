import { createCanvas } from "canvas";
import type { Canvas, CanvasRenderingContext2D } from "canvas";

interface OGImageOptions {
  question: string;
  interpretation: string;
  cardNames: string[];
  spreadType: string;
}

/**
 * 타로 리딩 결과용 OG 이미지 생성
 * 소셜 미디어 공유 시 미리보기로 사용됨
 */
export async function generateOGImage(options: OGImageOptions): Promise<Buffer> {
  const { question, interpretation, cardNames, spreadType } = options;

  // Canvas 크기 설정 (OG 이미지 표준: 1200x630)
  const width = 1200;
  const height = 630;
  const canvas = createCanvas(width, height) as Canvas;
  const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

  // 배경 그라데이션 (다크/골드 테마)
  const gradient = ctx.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, "#0a0e27"); // 진한 미드나이트
  gradient.addColorStop(1, "#1a1f3a"); // 약간 밝은 미드나이트
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  // 장식 요소: 코너 별 패턴
  ctx.fillStyle = "rgba(218, 165, 32, 0.1)";
  ctx.fillRect(0, 0, 40, 40);
  ctx.fillRect(width - 40, 0, 40, 40);
  ctx.fillRect(0, height - 40, 40, 40);
  ctx.fillRect(width - 40, height - 40, 40, 40);

  // 타이틀 영역
  const titleY = 80;
  ctx.font = "bold 48px 'Cinzel'";
  ctx.fillStyle = "#DAA520"; // 골드
  ctx.textAlign = "center";
  ctx.fillText("✦ MYSTIC TAROT ✦", width / 2, titleY);

  // 질문 텍스트
  const questionY = titleY + 80;
  ctx.font = "italic 28px 'Cormorant Garamond'";
  ctx.fillStyle = "#E8D5B7"; // 밝은 베이지
  ctx.textAlign = "center";

  // 질문이 길면 줄바꿈 처리
  const maxQuestionWidth = width - 100;
  const questionLines = wrapText(ctx, question, maxQuestionWidth, 28);
  let currentY = questionY;
  for (const line of questionLines.slice(0, 2)) {
    // 최대 2줄
    ctx.fillText(line, width / 2, currentY);
    currentY += 40;
  }

  // 스프레드 타입 및 카드명
  const cardInfoY = currentY + 40;
  ctx.font = "14px 'Cormorant Garamond'";
  ctx.fillStyle = "#B8860B"; // 어두운 골드
  const spreadLabel =
    spreadType === "single"
      ? "단일 카드"
      : spreadType === "three-card"
        ? "3장 스프레드"
        : "켈틱 크로스";
  ctx.fillText(`${spreadLabel} • ${cardNames.join(" • ")}`, width / 2, cardInfoY);

  // 해석 요약 (처음 100자)
  const summaryY = cardInfoY + 50;
  ctx.font = "16px 'Cormorant Garamond'";
  ctx.fillStyle = "#D3D3D3"; // 라이트 그레이
  ctx.textAlign = "center";

  const maxSummaryWidth = width - 120;
  const summary = interpretation.substring(0, 120) + (interpretation.length > 120 ? "..." : "");
  const summaryLines = wrapText(ctx, summary, maxSummaryWidth, 16);
  currentY = summaryY;
  for (const line of summaryLines.slice(0, 3)) {
    // 최대 3줄
    ctx.fillText(line, width / 2, currentY);
    currentY += 28;
  }

  // 하단 장식 및 URL
  const bottomY = height - 40;
  ctx.font = "12px 'Cormorant Garamond'";
  ctx.fillStyle = "rgba(218, 165, 32, 0.6)";
  ctx.fillText("tarotui-eeu5za5r.manus.space", width / 2, bottomY);

  // 하단 라인
  ctx.strokeStyle = "rgba(218, 165, 32, 0.3)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(100, height - 60);
  ctx.lineTo(width - 100, height - 60);
  ctx.stroke();

  return canvas.toBuffer("image/png");
}

/**
 * 텍스트를 주어진 너비에 맞게 줄바꿈
 */
function wrapText(
  ctx: any,
  text: string,
  maxWidth: number,
  fontSize: number
): string[] {
  const words = text.split(" ");
  const lines: string[] = [];
  let currentLine = "";

  for (const word of words) {
    const testLine = currentLine ? `${currentLine} ${word}` : word;
    const metrics = ctx.measureText(testLine);

    if (metrics.width > maxWidth && currentLine) {
      lines.push(currentLine);
      currentLine = word;
    } else {
      currentLine = testLine;
    }
  }

  if (currentLine) {
    lines.push(currentLine);
  }

  return lines;
}
