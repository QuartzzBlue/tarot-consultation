# Tarot Consultation - Project TODO

## Database & Backend
- [x] DB 스키마: tarot_cards 테이블 (78장 카드 정보)
- [x] DB 스키마: readings 테이블 (상담 히스토리)
- [x] DB 스키마: reading_cards 테이블 (리딩-카드 관계)
- [x] 마이그레이션 SQL 적용
- [x] 78장 타로카드 데이터 시딩
- [x] tRPC 라우터: 카드 목록 조회
- [x] tRPC 라우터: 타로 리딩 생성 (AI 해석 포함)
- [x] tRPC 라우터: 리딩 히스토리 조회
- [x] tRPC 라우터: 카드 이미지 생성

## Frontend - Design System
- [x] 다크/골드 글로벌 테마 (index.css)
- [x] Google Fonts (Cinzel, Cormorant Garamond) 적용
- [x] 공통 레이아웃 및 네비게이션 구성

## Frontend - Pages
- [x] 홈/랜딩 페이지 (신비로운 인트로)
- [x] 카드 선택 페이지 (인터랙티브 덱)
- [x] 질문 입력 폼
- [x] 리딩 결과 페이지 (카드 + AI 해석)
- [x] 히스토리 페이지 (과거 리딩 목록 및 상세)

## Features
- [x] 카드 뒤집기 애니메이션
- [x] AI 타로 해석 (LLM 연동)
- [x] 카드 이미지 AI 생성
- [x] 상담 히스토리 저장/조회
- [x] 로그인/인증 연동

## Testing
- [x] 타로 리딩 라우터 vitest 테스트 (8개 테스트 통과)
