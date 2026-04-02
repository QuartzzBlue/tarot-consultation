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


## UX 개선사항 (완료)
- [x] 덱 섞기 애니메이션 추가
- [x] 선택된 카드 블라인드 처리 + 선택 순서 표시
- [x] 리딩 확인 페이지: 선택 카드 뒤집기 모션


## OG 이미지 동적 생성 (완료)
- [x] OG 이미지 동적 렌더링 서버 라우트 구현
- [x] 운세 문구 포함 이미지 생성 (Canvas)
- [x] 메타 태그 동적 추가 (og:image, og:title, og:description)
- [x] 소셜 공유 버튼 UI 추가 (링크, 카톡, 이메일)
- [x] OG 이미지 캐싱 및 최적화


## 배포 실패 해결 (완료)
- [x] Canvas 패키지 제거 (네이티브 바인드 문제)
- [x] OG 이미지 생성 라우트 제거
- [x] 메타 태그 기반 소셜 공유로 대체
- [x] package.json에서 canvas 의존성 제거
- [x] 배포 재시도
