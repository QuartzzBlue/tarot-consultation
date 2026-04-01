import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import dotenv from "dotenv";
import { tarotCards as tarotCardsTable } from "../drizzle/schema.ts";
dotenv.config();

const connection = await mysql.createConnection(process.env.DATABASE_URL);
const db = drizzle(connection);

const tarotCards = [
  // ===== MAJOR ARCANA (0-21) =====
  {
    cardNumber: 0, name: "The Fool", nameKo: "바보", arcana: "major", suit: null,
    uprightMeaning: "새로운 시작, 순수함, 자발성, 자유로운 영혼, 모험",
    reversedMeaning: "무모함, 위험 감수, 무책임, 어리석음",
    description: "바보 카드는 여정의 시작을 상징합니다. 절벽 끝에 서서 새로운 모험을 향해 발걸음을 내딛는 젊은이의 모습으로, 순수한 잠재력과 무한한 가능성을 나타냅니다.",
    keywords: ["새로운 시작", "순수함", "모험", "자유", "가능성"],
    imagePrompt: "The Fool tarot card, mystical art nouveau style, young person at cliff edge with white rose, small dog, golden light, elegant dark background"
  },
  {
    cardNumber: 1, name: "The Magician", nameKo: "마법사", arcana: "major", suit: null,
    uprightMeaning: "의지력, 기술, 능력, 집중, 행동",
    reversedMeaning: "조작, 기만, 재능 낭비, 교활함",
    description: "마법사는 하늘과 땅을 연결하는 존재로, 네 원소(불, 물, 공기, 흙)를 자유자재로 다루는 능력을 상징합니다. 무한(∞) 기호가 그의 머리 위에 떠 있습니다.",
    keywords: ["의지력", "기술", "집중", "창조", "변환"],
    imagePrompt: "The Magician tarot card, mystical art nouveau style, robed figure with wand raised, infinity symbol, four elemental tools on table, golden mystical energy"
  },
  {
    cardNumber: 2, name: "The High Priestess", nameKo: "여사제", arcana: "major", suit: null,
    uprightMeaning: "직관, 신성한 여성성, 내면의 지식, 잠재의식",
    reversedMeaning: "숨겨진 의제, 직관 무시, 표면적 지식",
    description: "여사제는 신비와 직관의 수호자입니다. 두 기둥 사이에 앉아 베일 뒤의 진실을 알고 있으며, 달의 힘과 깊은 내면의 지혜를 상징합니다.",
    keywords: ["직관", "신비", "내면의 지혜", "잠재의식", "달"],
    imagePrompt: "The High Priestess tarot card, mystical art nouveau style, serene woman between two pillars, crescent moon, pomegranate veil, deep blue mystical atmosphere"
  },
  {
    cardNumber: 3, name: "The Empress", nameKo: "여황제", arcana: "major", suit: null,
    uprightMeaning: "풍요, 모성, 자연, 아름다움, 창의성",
    reversedMeaning: "창의성 차단, 의존성, 공허함, 과잉보호",
    description: "여황제는 풍요와 모성의 여신입니다. 자연의 풍요로움 속에 앉아 있으며, 생명력과 창조적 에너지를 상징합니다.",
    keywords: ["풍요", "모성", "자연", "창의성", "아름다움"],
    imagePrompt: "The Empress tarot card, mystical art nouveau style, regal woman in lush garden, crown of stars, wheat and roses, golden abundance, nature goddess"
  },
  {
    cardNumber: 4, name: "The Emperor", nameKo: "황제", arcana: "major", suit: null,
    uprightMeaning: "권위, 구조, 통제, 아버지상, 안정",
    reversedMeaning: "지배, 경직성, 통제 상실, 독재",
    description: "황제는 권위와 질서의 상징입니다. 왕좌에 앉아 홀과 구체를 들고 있으며, 세상의 법칙과 구조를 수호하는 존재입니다.",
    keywords: ["권위", "구조", "안정", "통제", "아버지"],
    imagePrompt: "The Emperor tarot card, mystical art nouveau style, powerful ruler on stone throne, ram heads, red robes, mountains, golden scepter, commanding presence"
  },
  {
    cardNumber: 5, name: "The Hierophant", nameKo: "교황", arcana: "major", suit: null,
    uprightMeaning: "전통, 종교, 관습, 교육, 영적 지혜",
    reversedMeaning: "반항, 전통 거부, 새로운 방법, 자유사상",
    description: "교황은 영적 권위와 전통적 가르침의 수호자입니다. 두 제자 앞에서 축복을 내리며, 신성한 지식을 세상에 전달하는 역할을 합니다.",
    keywords: ["전통", "영적 지혜", "교육", "관습", "축복"],
    imagePrompt: "The Hierophant tarot card, mystical art nouveau style, robed religious figure on throne, two acolytes, triple cross, keys, sacred ceremony atmosphere"
  },
  {
    cardNumber: 6, name: "The Lovers", nameKo: "연인", arcana: "major", suit: null,
    uprightMeaning: "사랑, 조화, 관계, 가치 정렬, 선택",
    reversedMeaning: "불균형, 잘못된 선택, 불화, 가치 불일치",
    description: "연인 카드는 사랑과 선택의 순간을 나타냅니다. 두 인물 위에 천사가 축복을 내리며, 이는 진정한 사랑과 중요한 결정의 순간을 상징합니다.",
    keywords: ["사랑", "선택", "조화", "관계", "가치"],
    imagePrompt: "The Lovers tarot card, mystical art nouveau style, two figures under angelic blessing, garden of eden, golden light from above, romantic mystical atmosphere"
  },
  {
    cardNumber: 7, name: "The Chariot", nameKo: "전차", arcana: "major", suit: null,
    uprightMeaning: "통제, 의지력, 승리, 단호함, 성공",
    reversedMeaning: "자기 훈련 부족, 공격성, 방향 상실",
    description: "전차는 의지력과 승리의 상징입니다. 두 스핑크스가 끄는 전차를 탄 전사가 승리를 향해 나아가며, 강한 의지와 집중력을 나타냅니다.",
    keywords: ["승리", "의지력", "통제", "단호함", "전진"],
    imagePrompt: "The Chariot tarot card, mystical art nouveau style, armored warrior in chariot, black and white sphinxes, star crown, city in background, triumphant energy"
  },
  {
    cardNumber: 8, name: "Strength", nameKo: "힘", arcana: "major", suit: null,
    uprightMeaning: "힘, 용기, 인내, 통제, 자신감",
    reversedMeaning: "내면의 힘 부족, 자기 의심, 나약함",
    description: "힘 카드는 내면의 강인함을 나타냅니다. 여인이 사자의 입을 부드럽게 닫으며, 이는 육체적 힘이 아닌 내면의 용기와 자제력의 힘을 상징합니다.",
    keywords: ["내면의 힘", "용기", "인내", "자제력", "자신감"],
    imagePrompt: "Strength tarot card, mystical art nouveau style, graceful woman gently closing lion's mouth, infinity symbol, white robes, golden flowers, serene power"
  },
  {
    cardNumber: 9, name: "The Hermit", nameKo: "은둔자", arcana: "major", suit: null,
    uprightMeaning: "영적 탐구, 내면 탐색, 고독, 지도, 명상",
    reversedMeaning: "고립, 외로움, 사회적 철수, 내면 거부",
    description: "은둔자는 지혜와 내면 탐구의 상징입니다. 산꼭대기에서 등불을 들고 홀로 서 있으며, 깊은 영적 성찰과 내면의 빛을 찾는 여정을 나타냅니다.",
    keywords: ["고독", "내면 탐구", "지혜", "명상", "영적 탐구"],
    imagePrompt: "The Hermit tarot card, mystical art nouveau style, cloaked elder on mountain peak, lantern with star, staff, snow and darkness, solitary wisdom seeker"
  },
  {
    cardNumber: 10, name: "Wheel of Fortune", nameKo: "운명의 수레바퀴", arcana: "major", suit: null,
    uprightMeaning: "운명, 기회, 행운, 변화, 사이클",
    reversedMeaning: "불운, 저항, 변화 거부, 통제 상실",
    description: "운명의 수레바퀴는 삶의 순환과 변화를 상징합니다. 끊임없이 돌아가는 바퀴는 모든 것이 변한다는 진리와 운명의 힘을 나타냅니다.",
    keywords: ["운명", "변화", "기회", "사이클", "행운"],
    imagePrompt: "Wheel of Fortune tarot card, mystical art nouveau style, great wheel with symbols, sphinx on top, serpent and Anubis, four evangelists in corners, cosmic energy"
  },
  {
    cardNumber: 11, name: "Justice", nameKo: "정의", arcana: "major", suit: null,
    uprightMeaning: "공정성, 진실, 법, 원인과 결과, 균형",
    reversedMeaning: "불공정, 불정직, 책임 회피, 불균형",
    description: "정의는 균형과 공정함의 상징입니다. 저울과 검을 들고 있는 인물은 모든 행동에는 결과가 따른다는 카르마의 법칙을 나타냅니다.",
    keywords: ["공정성", "진실", "균형", "법", "카르마"],
    imagePrompt: "Justice tarot card, mystical art nouveau style, robed figure with scales and sword, red robes, purple veil, balanced pillars, truth and fairness atmosphere"
  },
  {
    cardNumber: 12, name: "The Hanged Man", nameKo: "매달린 남자", arcana: "major", suit: null,
    uprightMeaning: "일시 정지, 항복, 새로운 관점, 희생",
    reversedMeaning: "지연, 저항, 희생 거부, 정체",
    description: "매달린 남자는 자발적 희생과 새로운 관점을 상징합니다. 나무에 거꾸로 매달려 있지만 평온한 표정으로, 다른 시각으로 세상을 바라보는 지혜를 나타냅니다.",
    keywords: ["일시 정지", "새로운 관점", "희생", "항복", "깨달음"],
    imagePrompt: "The Hanged Man tarot card, mystical art nouveau style, serene figure hanging upside down from living tree, golden halo, calm expression, spiritual suspension"
  },
  {
    cardNumber: 13, name: "Death", nameKo: "죽음", arcana: "major", suit: null,
    uprightMeaning: "변화, 전환, 끝과 새로운 시작, 변형",
    reversedMeaning: "변화 저항, 정체, 부패, 불가피한 것 거부",
    description: "죽음 카드는 실제 죽음이 아닌 변화와 전환을 상징합니다. 백마를 탄 해골 기사는 모든 것이 끝나고 새로운 것이 시작된다는 자연의 순환을 나타냅니다.",
    keywords: ["변화", "전환", "끝", "새로운 시작", "변형"],
    imagePrompt: "Death tarot card, mystical art nouveau style, skeleton knight on white horse, black flag with white rose, sunrise in distance, transformation and renewal energy"
  },
  {
    cardNumber: 14, name: "Temperance", nameKo: "절제", arcana: "major", suit: null,
    uprightMeaning: "균형, 절제, 인내, 목적, 의미 찾기",
    reversedMeaning: "불균형, 과잉, 자기 치유 부족, 극단",
    description: "절제는 균형과 조화의 천사입니다. 두 컵 사이에 물을 붓는 천사는 인내와 절제를 통해 완벽한 균형을 이루는 지혜를 상징합니다.",
    keywords: ["균형", "절제", "인내", "조화", "통합"],
    imagePrompt: "Temperance tarot card, mystical art nouveau style, angelic figure pouring water between cups, one foot in water one on land, golden triangle, rainbow, serene balance"
  },
  {
    cardNumber: 15, name: "The Devil", nameKo: "악마", arcana: "major", suit: null,
    uprightMeaning: "속박, 집착, 물질주의, 섹슈얼리티, 그림자 자아",
    reversedMeaning: "해방, 자유, 통제 되찾기, 집착 해소",
    description: "악마는 우리를 속박하는 것들을 상징합니다. 사슬에 묶인 두 인물은 자신의 욕망과 두려움에 스스로를 가두고 있음을 나타냅니다.",
    keywords: ["속박", "집착", "물질주의", "그림자", "유혹"],
    imagePrompt: "The Devil tarot card, mystical art nouveau style, horned figure on dark throne, chained figures, inverted pentagram, dark dramatic atmosphere, shadow and temptation"
  },
  {
    cardNumber: 16, name: "The Tower", nameKo: "탑", arcana: "major", suit: null,
    uprightMeaning: "갑작스러운 변화, 혼란, 계시, 각성, 혼돈",
    reversedMeaning: "재앙 회피, 변화 두려움, 위기 지연",
    description: "탑은 갑작스러운 변화와 혼란을 상징합니다. 번개에 맞아 무너지는 탑에서 사람들이 떨어지는 모습은 예상치 못한 충격과 각성을 나타냅니다.",
    keywords: ["혼란", "갑작스러운 변화", "각성", "파괴", "계시"],
    imagePrompt: "The Tower tarot card, mystical art nouveau style, lightning striking tall tower, figures falling, crown blown off, dark stormy sky, dramatic chaos and revelation"
  },
  {
    cardNumber: 17, name: "The Star", nameKo: "별", arcana: "major", suit: null,
    uprightMeaning: "희망, 영감, 평온, 재생, 영적 연결",
    reversedMeaning: "절망, 낙담, 자기 신뢰 부족, 단절",
    description: "별은 희망과 영감의 빛입니다. 별빛 아래 물을 붓는 여인은 치유와 재생, 그리고 미래에 대한 희망을 상징합니다.",
    keywords: ["희망", "영감", "치유", "재생", "평온"],
    imagePrompt: "The Star tarot card, mystical art nouveau style, naked woman pouring water under starry sky, large central star, seven smaller stars, peaceful night, renewal and hope"
  },
  {
    cardNumber: 18, name: "The Moon", nameKo: "달", arcana: "major", suit: null,
    uprightMeaning: "환상, 두려움, 잠재의식, 불안, 혼란",
    reversedMeaning: "혼란 해소, 두려움 극복, 명확성, 억압된 것 해방",
    description: "달은 환상과 잠재의식의 세계를 상징합니다. 보름달 아래 개와 늑대가 울부짖고 가재가 물에서 나오는 모습은 무의식의 깊은 세계를 나타냅니다.",
    keywords: ["환상", "잠재의식", "두려움", "불안", "직관"],
    imagePrompt: "The Moon tarot card, mystical art nouveau style, full moon with face, wolf and dog howling, crayfish emerging from water, mysterious path, dream-like atmosphere"
  },
  {
    cardNumber: 19, name: "The Sun", nameKo: "태양", arcana: "major", suit: null,
    uprightMeaning: "긍정성, 즐거움, 성공, 활력, 자신감",
    reversedMeaning: "내면의 아이 차단, 비관주의, 슬픔",
    description: "태양은 기쁨과 성공의 상징입니다. 밝게 빛나는 태양 아래 어린아이가 백마를 타고 있는 모습은 순수한 행복과 생명력을 나타냅니다.",
    keywords: ["기쁨", "성공", "활력", "긍정", "자신감"],
    imagePrompt: "The Sun tarot card, mystical art nouveau style, radiant sun with face, joyful child on white horse, sunflowers, warm golden light, celebration and vitality"
  },
  {
    cardNumber: 20, name: "Judgement", nameKo: "심판", arcana: "major", suit: null,
    uprightMeaning: "반성, 내면의 부름, 용서, 각성, 재탄생",
    reversedMeaning: "자기 의심, 내면의 비판, 과거 집착",
    description: "심판은 각성과 재탄생의 순간입니다. 천사의 나팔 소리에 무덤에서 일어나는 사람들은 높은 차원의 부름에 응답하는 영적 각성을 상징합니다.",
    keywords: ["각성", "재탄생", "반성", "용서", "부름"],
    imagePrompt: "Judgement tarot card, mystical art nouveau style, angel blowing trumpet from clouds, figures rising from graves, mountains, divine calling, spiritual awakening"
  },
  {
    cardNumber: 21, name: "The World", nameKo: "세계", arcana: "major", suit: null,
    uprightMeaning: "완성, 통합, 성취, 여행, 완전함",
    reversedMeaning: "미완성, 지름길, 지연",
    description: "세계는 완성과 성취의 카드입니다. 월계수 화환 안에서 춤추는 인물은 모든 여정의 완성과 우주와의 합일을 상징합니다.",
    keywords: ["완성", "성취", "통합", "완전함", "성공"],
    imagePrompt: "The World tarot card, mystical art nouveau style, dancing figure in laurel wreath, four evangelists in corners, cosmic completion, celebration of wholeness"
  },

  // ===== MINOR ARCANA - WANDS (22-35) =====
  {
    cardNumber: 22, name: "Ace of Wands", nameKo: "완드 에이스", arcana: "minor", suit: "wands",
    uprightMeaning: "영감, 새로운 기회, 성장, 잠재력",
    reversedMeaning: "창의성 부족, 지연, 방향 부재",
    description: "완드 에이스는 불의 원소와 창조적 에너지의 시작을 상징합니다. 구름에서 나온 손이 잎이 돋아나는 지팡이를 들고 있습니다.",
    keywords: ["영감", "새로운 시작", "창의성", "열정", "잠재력"],
    imagePrompt: "Ace of Wands tarot card, mystical art nouveau style, hand emerging from cloud holding blooming wand, fire energy, green leaves, golden light, creative potential"
  },
  {
    cardNumber: 23, name: "Two of Wands", nameKo: "완드 2", arcana: "minor", suit: "wands",
    uprightMeaning: "미래 계획, 진보, 결정, 발견",
    reversedMeaning: "두려움, 계획 부재, 안전지대 집착",
    description: "완드 2는 미래를 바라보며 계획을 세우는 순간을 나타냅니다. 성벽 위에서 지구본을 들고 먼 곳을 바라보는 인물의 모습입니다.",
    keywords: ["계획", "미래", "결정", "발견", "진보"],
    imagePrompt: "Two of Wands tarot card, mystical art nouveau style, figure on castle wall holding globe, two wands, distant landscape, planning and vision, fire energy"
  },
  {
    cardNumber: 24, name: "Three of Wands", nameKo: "완드 3", arcana: "minor", suit: "wands",
    uprightMeaning: "확장, 선견지명, 해외 여행, 성장",
    reversedMeaning: "장애물, 지연, 좌절, 제한",
    description: "완드 3은 확장과 성장을 상징합니다. 세 개의 지팡이 사이에 서서 먼 바다를 바라보는 인물은 더 넓은 세계로의 진출을 나타냅니다.",
    keywords: ["확장", "성장", "선견지명", "여행", "기회"],
    imagePrompt: "Three of Wands tarot card, mystical art nouveau style, figure overlooking sea with ships, three wands, expansive horizon, growth and exploration, warm fire tones"
  },
  {
    cardNumber: 25, name: "Four of Wands", nameKo: "완드 4", arcana: "minor", suit: "wands",
    uprightMeaning: "축하, 기쁨, 조화, 안정, 집",
    reversedMeaning: "불안정, 가족 갈등, 전환기",
    description: "완드 4는 축하와 기쁨의 카드입니다. 꽃으로 장식된 네 개의 지팡이 아래에서 사람들이 춤을 추며 성공과 안정을 기념합니다.",
    keywords: ["축하", "기쁨", "안정", "조화", "집"],
    imagePrompt: "Four of Wands tarot card, mystical art nouveau style, four decorated wands forming canopy, celebrating figures, flowers and garlands, joyful festivity, warm golden light"
  },
  {
    cardNumber: 26, name: "Five of Wands", nameKo: "완드 5", arcana: "minor", suit: "wands",
    uprightMeaning: "갈등, 경쟁, 긴장, 다양성, 도전",
    reversedMeaning: "갈등 회피, 긴장 해소, 타협",
    description: "완드 5는 갈등과 경쟁을 나타냅니다. 다섯 명이 지팡이를 들고 서로 겨루는 모습은 의견 충돌과 경쟁을 상징합니다.",
    keywords: ["갈등", "경쟁", "도전", "긴장", "다양성"],
    imagePrompt: "Five of Wands tarot card, mystical art nouveau style, five figures clashing with wands, competitive struggle, dynamic energy, conflict and challenge, fire element"
  },
  {
    cardNumber: 27, name: "Six of Wands", nameKo: "완드 6", arcana: "minor", suit: "wands",
    uprightMeaning: "성공, 공공 인정, 진보, 자신감",
    reversedMeaning: "자기 의심, 실패, 인정 부족",
    description: "완드 6은 승리와 공공 인정을 상징합니다. 월계관을 쓰고 백마를 탄 인물이 군중의 환호를 받으며 행진합니다.",
    keywords: ["승리", "성공", "인정", "자신감", "진보"],
    imagePrompt: "Six of Wands tarot card, mystical art nouveau style, victorious rider on white horse, laurel wreath, cheering crowd, six wands, triumph and recognition"
  },
  {
    cardNumber: 28, name: "Seven of Wands", nameKo: "완드 7", arcana: "minor", suit: "wands",
    uprightMeaning: "도전, 경쟁, 보호, 인내, 방어",
    reversedMeaning: "압도, 포기, 방어적 태도",
    description: "완드 7은 도전에 맞서는 용기를 나타냅니다. 높은 곳에서 여섯 개의 지팡이에 맞서 싸우는 인물은 역경에 굴하지 않는 의지를 상징합니다.",
    keywords: ["도전", "방어", "인내", "경쟁", "용기"],
    imagePrompt: "Seven of Wands tarot card, mystical art nouveau style, figure on high ground defending against six wands below, determined stance, courage and perseverance"
  },
  {
    cardNumber: 29, name: "Eight of Wands", nameKo: "완드 8", arcana: "minor", suit: "wands",
    uprightMeaning: "빠른 행동, 움직임, 여행, 신속함",
    reversedMeaning: "지연, 좌절, 내부 정렬 부족",
    description: "완드 8은 빠른 움직임과 신속한 진행을 상징합니다. 하늘을 가로질러 날아가는 여덟 개의 지팡이는 빠른 변화와 여행을 나타냅니다.",
    keywords: ["빠른 행동", "움직임", "여행", "신속함", "진전"],
    imagePrompt: "Eight of Wands tarot card, mystical art nouveau style, eight wands flying through air, swift movement, clear sky, rapid progress and travel, dynamic energy"
  },
  {
    cardNumber: 30, name: "Nine of Wands", nameKo: "완드 9", arcana: "minor", suit: "wands",
    uprightMeaning: "회복력, 용기, 인내, 테스트, 경계",
    reversedMeaning: "피로, 포기, 방어적 태도",
    description: "완드 9는 지쳤지만 포기하지 않는 인내를 상징합니다. 상처를 입었지만 여전히 지팡이를 붙들고 서 있는 인물은 마지막 힘을 다해 버티는 모습입니다.",
    keywords: ["인내", "회복력", "용기", "테스트", "경계"],
    imagePrompt: "Nine of Wands tarot card, mystical art nouveau style, wounded but determined figure leaning on wand, eight wands behind, resilience and perseverance, battle-worn"
  },
  {
    cardNumber: 31, name: "Ten of Wands", nameKo: "완드 10", arcana: "minor", suit: "wands",
    uprightMeaning: "부담, 책임, 과로, 압박",
    reversedMeaning: "짐 내려놓기, 위임, 자유",
    description: "완드 10은 과도한 부담을 상징합니다. 열 개의 지팡이를 힘겹게 들고 가는 인물은 너무 많은 책임과 의무를 짊어진 상태를 나타냅니다.",
    keywords: ["부담", "책임", "과로", "압박", "집착"],
    imagePrompt: "Ten of Wands tarot card, mystical art nouveau style, figure struggling under heavy burden of ten wands, bent over, distant village, overload and responsibility"
  },
  {
    cardNumber: 32, name: "Page of Wands", nameKo: "완드 시종", arcana: "minor", suit: "wands",
    uprightMeaning: "탐험, 흥분, 자유로운 영혼, 창의성",
    reversedMeaning: "방향 부재, 지연, 창의성 차단",
    description: "완드 시종은 열정적이고 호기심 많은 젊은 에너지를 상징합니다. 도마뱀이 새겨진 옷을 입고 지팡이를 바라보는 젊은이의 모습입니다.",
    keywords: ["탐험", "열정", "창의성", "호기심", "자유"],
    imagePrompt: "Page of Wands tarot card, mystical art nouveau style, young figure in salamander-decorated clothes, holding wand, desert background, enthusiastic and adventurous"
  },
  {
    cardNumber: 33, name: "Knight of Wands", nameKo: "완드 기사", arcana: "minor", suit: "wands",
    uprightMeaning: "에너지, 열정, 영감, 모험, 충동",
    reversedMeaning: "분노, 충동, 무모함, 좌절",
    description: "완드 기사는 불타는 열정과 모험 정신을 상징합니다. 뛰어오르는 말 위에서 지팡이를 높이 든 기사는 열정적이고 충동적인 에너지를 나타냅니다.",
    keywords: ["열정", "에너지", "모험", "충동", "행동"],
    imagePrompt: "Knight of Wands tarot card, mystical art nouveau style, armored knight on rearing horse, salamander armor, wand raised, desert pyramids, passionate energy"
  },
  {
    cardNumber: 34, name: "Queen of Wands", nameKo: "완드 여왕", arcana: "minor", suit: "wands",
    uprightMeaning: "용기, 자신감, 독립성, 사회성, 결단력",
    reversedMeaning: "이기심, 질투, 고집, 요구가 많음",
    description: "완드 여왕은 자신감 넘치는 카리스마를 상징합니다. 해바라기와 검은 고양이를 곁에 두고 왕좌에 앉은 여왕은 강하고 독립적인 여성 에너지를 나타냅니다.",
    keywords: ["자신감", "용기", "독립성", "카리스마", "결단력"],
    imagePrompt: "Queen of Wands tarot card, mystical art nouveau style, confident queen on throne, sunflowers, black cat at feet, wand with lion, warm fire energy, commanding presence"
  },
  {
    cardNumber: 35, name: "King of Wands", nameKo: "완드 왕", arcana: "minor", suit: "wands",
    uprightMeaning: "자연스러운 리더십, 비전, 기업가 정신, 명예",
    reversedMeaning: "충동적, 오만, 독재적",
    description: "완드 왕은 비전 있는 리더십을 상징합니다. 도마뱀과 사자로 장식된 왕좌에 앉은 왕은 창의적이고 영감을 주는 지도자를 나타냅니다.",
    keywords: ["리더십", "비전", "기업가 정신", "명예", "열정"],
    imagePrompt: "King of Wands tarot card, mystical art nouveau style, powerful king on salamander throne, lion and lizard symbols, wand, commanding fire energy, visionary leader"
  },

  // ===== MINOR ARCANA - CUPS (36-49) =====
  {
    cardNumber: 36, name: "Ace of Cups", nameKo: "컵 에이스", arcana: "minor", suit: "cups",
    uprightMeaning: "새로운 감정, 직관, 친밀감, 사랑의 시작",
    reversedMeaning: "감정 차단, 공허함, 억압된 감정",
    description: "컵 에이스는 감정과 사랑의 새로운 시작을 상징합니다. 구름에서 나온 손이 오버플로우하는 컵을 들고 있으며, 비둘기가 성배에 성체를 넣는 모습입니다.",
    keywords: ["사랑", "새로운 감정", "직관", "친밀감", "풍요"],
    imagePrompt: "Ace of Cups tarot card, mystical art nouveau style, hand from cloud holding overflowing chalice, dove with communion wafer, lotus flowers, water element, emotional abundance"
  },
  {
    cardNumber: 37, name: "Two of Cups", nameKo: "컵 2", arcana: "minor", suit: "cups",
    uprightMeaning: "통합, 파트너십, 상호 매력, 관계",
    reversedMeaning: "자기 사랑 부족, 불균형, 이별",
    description: "컵 2는 두 사람 사이의 깊은 연결을 상징합니다. 두 인물이 컵을 교환하며 서로를 바라보는 모습은 진정한 파트너십과 상호 존중을 나타냅니다.",
    keywords: ["파트너십", "연결", "사랑", "상호 매력", "관계"],
    imagePrompt: "Two of Cups tarot card, mystical art nouveau style, two figures exchanging cups, caduceus with lion, mutual attraction, romantic connection, water element harmony"
  },
  {
    cardNumber: 38, name: "Three of Cups", nameKo: "컵 3", arcana: "minor", suit: "cups",
    uprightMeaning: "축하, 우정, 창의성, 공동체",
    reversedMeaning: "과잉 탐닉, 삼각관계, 고립",
    description: "컵 3은 우정과 축하의 기쁨을 상징합니다. 세 여인이 컵을 들고 춤을 추며 함께하는 기쁨과 공동체의 따뜻함을 나타냅니다.",
    keywords: ["축하", "우정", "공동체", "기쁨", "창의성"],
    imagePrompt: "Three of Cups tarot card, mystical art nouveau style, three women dancing and raising cups, flowers and abundance, joyful celebration, sisterhood and community"
  },
  {
    cardNumber: 39, name: "Four of Cups", nameKo: "컵 4", arcana: "minor", suit: "cups",
    uprightMeaning: "명상, 내성, 무관심, 재평가",
    reversedMeaning: "새로운 가능성 수용, 무관심 극복",
    description: "컵 4는 내면 성찰과 무관심을 상징합니다. 나무 아래 앉아 세 개의 컵을 바라보는 인물은 구름에서 제공되는 네 번째 컵을 무시하고 있습니다.",
    keywords: ["명상", "내성", "무관심", "재평가", "고독"],
    imagePrompt: "Four of Cups tarot card, mystical art nouveau style, contemplative figure under tree, three cups before them, hand from cloud offering fourth cup, introspection and apathy"
  },
  {
    cardNumber: 40, name: "Five of Cups", nameKo: "컵 5", arcana: "minor", suit: "cups",
    uprightMeaning: "후회, 실패, 슬픔, 상실, 비탄",
    reversedMeaning: "수용, 앞으로 나아가기, 용서",
    description: "컵 5는 상실과 슬픔을 상징합니다. 검은 망토를 입은 인물이 쓰러진 세 개의 컵을 바라보며 슬퍼하지만, 뒤에는 두 개의 컵이 여전히 서 있습니다.",
    keywords: ["슬픔", "상실", "후회", "비탄", "실망"],
    imagePrompt: "Five of Cups tarot card, mystical art nouveau style, cloaked figure mourning over spilled cups, two standing cups behind, bridge and castle, grief and loss, water element"
  },
  {
    cardNumber: 41, name: "Six of Cups", nameKo: "컵 6", arcana: "minor", suit: "cups",
    uprightMeaning: "향수, 과거, 순수함, 기억, 어린 시절",
    reversedMeaning: "과거 집착, 순진함, 현실 도피",
    description: "컵 6은 행복한 기억과 향수를 상징합니다. 어린 소년이 소녀에게 꽃이 담긴 컵을 건네는 모습은 순수한 어린 시절의 기억을 나타냅니다.",
    keywords: ["향수", "어린 시절", "순수함", "기억", "과거"],
    imagePrompt: "Six of Cups tarot card, mystical art nouveau style, children in garden, boy offering cup with flowers to girl, nostalgic village scene, innocence and happy memories"
  },
  {
    cardNumber: 42, name: "Seven of Cups", nameKo: "컵 7", arcana: "minor", suit: "cups",
    uprightMeaning: "환상, 환각, 소원, 선택, 상상",
    reversedMeaning: "정렬, 개인 가치, 명확성",
    description: "컵 7은 환상과 선택의 혼란을 상징합니다. 구름 속에 떠 있는 일곱 개의 컵에는 각각 다른 것들이 담겨 있으며, 이는 많은 선택지와 환상을 나타냅니다.",
    keywords: ["환상", "선택", "소원", "상상", "혼란"],
    imagePrompt: "Seven of Cups tarot card, mystical art nouveau style, seven cups in clouds with different visions inside, silhouetted figure, dreams and illusions, water element fantasy"
  },
  {
    cardNumber: 43, name: "Eight of Cups", nameKo: "컵 8", arcana: "minor", suit: "cups",
    uprightMeaning: "떠남, 포기, 더 깊은 의미 추구, 실망",
    reversedMeaning: "두려움, 집착, 떠나지 못함",
    description: "컵 8은 뒤를 돌아보지 않고 떠나는 결단을 상징합니다. 달빛 아래 여덟 개의 컵을 뒤로 하고 산을 향해 걸어가는 인물의 모습입니다.",
    keywords: ["떠남", "포기", "추구", "실망", "전환"],
    imagePrompt: "Eight of Cups tarot card, mystical art nouveau style, cloaked figure walking away from eight stacked cups, moonlit mountain path, abandonment and deeper search"
  },
  {
    cardNumber: 44, name: "Nine of Cups", nameKo: "컵 9", arcana: "minor", suit: "cups",
    uprightMeaning: "만족, 행복, 소원 성취, 풍요",
    reversedMeaning: "내면의 행복 부족, 물질주의, 불만족",
    description: "컵 9는 소원 성취와 만족을 상징합니다. 만족스러운 표정으로 팔짱을 낀 채 아홉 개의 컵 앞에 앉아 있는 인물은 모든 소원이 이루어진 상태를 나타냅니다.",
    keywords: ["만족", "소원 성취", "행복", "풍요", "감사"],
    imagePrompt: "Nine of Cups tarot card, mystical art nouveau style, satisfied figure seated before nine cups on shelf, content smile, wish fulfillment and emotional abundance"
  },
  {
    cardNumber: 45, name: "Ten of Cups", nameKo: "컵 10", arcana: "minor", suit: "cups",
    uprightMeaning: "행복한 가정, 조화, 정렬, 축복",
    reversedMeaning: "가족 갈등, 불화, 가치 불일치",
    description: "컵 10은 완벽한 행복과 가정의 조화를 상징합니다. 무지개 아래 열 개의 컵이 빛나고, 가족이 함께 기뻐하는 모습은 진정한 행복을 나타냅니다.",
    keywords: ["행복", "가정", "조화", "축복", "완성"],
    imagePrompt: "Ten of Cups tarot card, mystical art nouveau style, rainbow of ten cups, happy family with children, beautiful home, divine blessing, perfect harmony and joy"
  },
  {
    cardNumber: 46, name: "Page of Cups", nameKo: "컵 시종", arcana: "minor", suit: "cups",
    uprightMeaning: "창의적 기회, 직관적 메시지, 감수성",
    reversedMeaning: "감정적 미성숙, 창의성 차단",
    description: "컵 시종은 감수성이 풍부하고 창의적인 젊은 에너지를 상징합니다. 컵에서 물고기가 나오는 것을 바라보는 젊은이의 모습은 직관과 상상력을 나타냅니다.",
    keywords: ["창의성", "직관", "감수성", "메시지", "상상력"],
    imagePrompt: "Page of Cups tarot card, mystical art nouveau style, young figure in floral tunic, fish emerging from cup, ocean waves, dreamy and intuitive, creative messages"
  },
  {
    cardNumber: 47, name: "Knight of Cups", nameKo: "컵 기사", arcana: "minor", suit: "cups",
    uprightMeaning: "창의성, 낭만, 매력, 상상력, 아름다움",
    reversedMeaning: "과잉 감정, 질투, 비현실적",
    description: "컵 기사는 낭만적이고 이상주의적인 에너지를 상징합니다. 천천히 걷는 말 위에서 컵을 들고 있는 기사는 감정과 상상력을 중시하는 이상주의자를 나타냅니다.",
    keywords: ["낭만", "창의성", "이상주의", "매력", "상상력"],
    imagePrompt: "Knight of Cups tarot card, mystical art nouveau style, romantic knight on white horse, offering cup, fish-decorated armor, flowing river, idealistic and charming"
  },
  {
    cardNumber: 48, name: "Queen of Cups", nameKo: "컵 여왕", arcana: "minor", suit: "cups",
    uprightMeaning: "자비, 직관, 감수성, 내면의 감정",
    reversedMeaning: "감정적 불안정, 의존성, 순교자 콤플렉스",
    description: "컵 여왕은 깊은 감수성과 직관을 상징합니다. 바다 옆 왕좌에 앉아 장식된 컵을 바라보는 여왕은 감정의 깊이와 공감 능력을 나타냅니다.",
    keywords: ["자비", "직관", "감수성", "공감", "치유"],
    imagePrompt: "Queen of Cups tarot card, mystical art nouveau style, compassionate queen on throne by sea, ornate covered cup, mermaids on throne, deep emotional wisdom and intuition"
  },
  {
    cardNumber: 49, name: "King of Cups", nameKo: "컵 왕", arcana: "minor", suit: "cups",
    uprightMeaning: "감정적 균형, 자비, 외교, 지혜",
    reversedMeaning: "감정적 조작, 변덕, 통제 부족",
    description: "컵 왕은 감정적 성숙과 지혜를 상징합니다. 바다 위 왕좌에 앉아 있는 왕은 감정을 지혜롭게 다루는 성숙한 리더를 나타냅니다.",
    keywords: ["감정적 균형", "자비", "지혜", "외교", "성숙"],
    imagePrompt: "King of Cups tarot card, mystical art nouveau style, wise king on throne amid turbulent sea, fish amulet, scepter, emotional mastery and diplomatic wisdom"
  },

  // ===== MINOR ARCANA - SWORDS (50-63) =====
  {
    cardNumber: 50, name: "Ace of Swords", nameKo: "소드 에이스", arcana: "minor", suit: "swords",
    uprightMeaning: "돌파구, 명확성, 날카로운 마음, 진실",
    reversedMeaning: "혼란, 잔인함, 혼돈",
    description: "소드 에이스는 정신적 명확성과 진실의 힘을 상징합니다. 구름에서 나온 손이 왕관과 올리브 가지로 장식된 검을 들고 있습니다.",
    keywords: ["명확성", "진실", "돌파구", "지성", "결단"],
    imagePrompt: "Ace of Swords tarot card, mystical art nouveau style, hand from cloud holding upright sword, crown with olive and palm branches, air element, clarity and truth"
  },
  {
    cardNumber: 51, name: "Two of Swords", nameKo: "소드 2", arcana: "minor", suit: "swords",
    uprightMeaning: "어려운 결정, 교착 상태, 정보 차단",
    reversedMeaning: "혼란, 정보 과부하, 결정 불능",
    description: "소드 2는 결정의 어려움과 교착 상태를 상징합니다. 눈을 가리고 두 개의 검을 들고 앉아 있는 인물은 어려운 선택 앞에 놓인 상황을 나타냅니다.",
    keywords: ["결정", "교착 상태", "균형", "차단", "딜레마"],
    imagePrompt: "Two of Swords tarot card, mystical art nouveau style, blindfolded figure holding two crossed swords, crescent moon, calm sea, difficult decision and stalemate"
  },
  {
    cardNumber: 52, name: "Three of Swords", nameKo: "소드 3", arcana: "minor", suit: "swords",
    uprightMeaning: "심장의 고통, 슬픔, 비탄, 거부",
    reversedMeaning: "회복, 용서, 과거 극복",
    description: "소드 3은 깊은 슬픔과 상처를 상징합니다. 세 개의 검이 심장을 관통하는 이미지는 배신, 이별, 상실로 인한 극심한 고통을 나타냅니다.",
    keywords: ["슬픔", "고통", "배신", "상실", "비탄"],
    imagePrompt: "Three of Swords tarot card, mystical art nouveau style, three swords piercing a heart, stormy rain clouds, heartbreak and sorrow, emotional pain and grief"
  },
  {
    cardNumber: 53, name: "Four of Swords", nameKo: "소드 4", arcana: "minor", suit: "swords",
    uprightMeaning: "휴식, 회복, 명상, 평화, 고독",
    reversedMeaning: "소진, 번아웃, 휴식 거부",
    description: "소드 4는 휴식과 회복의 필요성을 상징합니다. 교회 안에 누워 있는 기사의 모습은 전투 후의 평화로운 휴식과 명상을 나타냅니다.",
    keywords: ["휴식", "회복", "명상", "평화", "고독"],
    imagePrompt: "Four of Swords tarot card, mystical art nouveau style, knight lying in repose in church, three swords on wall, one beneath, stained glass, peaceful rest and meditation"
  },
  {
    cardNumber: 54, name: "Five of Swords", nameKo: "소드 5", arcana: "minor", suit: "swords",
    uprightMeaning: "갈등, 불일치, 승리의 대가, 패배",
    reversedMeaning: "화해, 갈등 해소, 과거 극복",
    description: "소드 5는 갈등과 승리의 씁쓸함을 상징합니다. 세 개의 검을 들고 승리한 인물 뒤로 패배한 두 사람이 물러나는 모습은 공허한 승리를 나타냅니다.",
    keywords: ["갈등", "패배", "승리의 대가", "불일치", "씁쓸함"],
    imagePrompt: "Five of Swords tarot card, mystical art nouveau style, smirking figure with three swords, two defeated figures walking away, stormy sky, hollow victory and conflict"
  },
  {
    cardNumber: 55, name: "Six of Swords", nameKo: "소드 6", arcana: "minor", suit: "swords",
    uprightMeaning: "전환, 변화, 이동, 치유, 여행",
    reversedMeaning: "저항, 전환 불능, 과거 집착",
    description: "소드 6은 어려움에서 벗어나는 여정을 상징합니다. 배에 탄 인물들이 여섯 개의 검을 싣고 조용한 물 위를 건너가는 모습은 힘든 상황에서의 탈출을 나타냅니다.",
    keywords: ["전환", "이동", "치유", "여행", "탈출"],
    imagePrompt: "Six of Swords tarot card, mystical art nouveau style, figures in boat with six swords, calm and rough water, distant shore, transition and moving toward calmer times"
  },
  {
    cardNumber: 56, name: "Seven of Swords", nameKo: "소드 7", arcana: "minor", suit: "swords",
    uprightMeaning: "배신, 기만, 전략, 도둑질, 교활함",
    reversedMeaning: "양심의 가책, 자백, 정직으로의 복귀",
    description: "소드 7은 기만과 전략을 상징합니다. 다섯 개의 검을 몰래 들고 도망치는 인물은 교활함과 속임수, 혹은 영리한 전략을 나타냅니다.",
    keywords: ["기만", "전략", "교활함", "도둑질", "배신"],
    imagePrompt: "Seven of Swords tarot card, mystical art nouveau style, sneaky figure tiptoeing away with five swords, two left behind, military camp, deception and cunning strategy"
  },
  {
    cardNumber: 57, name: "Eight of Swords", nameKo: "소드 8", arcana: "minor", suit: "swords",
    uprightMeaning: "제한, 갇힘, 무력감, 자기 부과 제한",
    reversedMeaning: "자기 해방, 새로운 관점, 자유",
    description: "소드 8은 자기 부과적 제한을 상징합니다. 눈을 가리고 여덟 개의 검에 둘러싸인 채 묶여 있는 인물은 스스로 만든 감옥에 갇힌 상태를 나타냅니다.",
    keywords: ["제한", "갇힘", "무력감", "자기 제한", "두려움"],
    imagePrompt: "Eight of Swords tarot card, mystical art nouveau style, blindfolded bound figure surrounded by eight swords, muddy ground, castle in distance, self-imposed restriction"
  },
  {
    cardNumber: 58, name: "Nine of Swords", nameKo: "소드 9", arcana: "minor", suit: "swords",
    uprightMeaning: "불안, 걱정, 두려움, 악몽, 절망",
    reversedMeaning: "내면의 혼란, 희망, 회복",
    description: "소드 9는 불안과 악몽을 상징합니다. 침대에서 일어나 머리를 감싸 쥔 인물 위에 아홉 개의 검이 걸려 있는 모습은 극심한 정신적 고통을 나타냅니다.",
    keywords: ["불안", "악몽", "걱정", "두려움", "절망"],
    imagePrompt: "Nine of Swords tarot card, mystical art nouveau style, anguished figure sitting up in bed, nine swords on dark wall, nightmares and anxiety, mental anguish"
  },
  {
    cardNumber: 59, name: "Ten of Swords", nameKo: "소드 10", arcana: "minor", suit: "swords",
    uprightMeaning: "고통스러운 끝, 배신, 상실, 위기",
    reversedMeaning: "회복, 재생, 저항, 생존",
    description: "소드 10은 극적인 끝과 패배를 상징합니다. 열 개의 검이 등에 꽂힌 채 쓰러진 인물은 완전한 패배와 끝을 나타내지만, 동시에 새벽의 시작을 암시합니다.",
    keywords: ["끝", "패배", "배신", "위기", "새벽"],
    imagePrompt: "Ten of Swords tarot card, mystical art nouveau style, fallen figure with ten swords in back, dawn breaking on horizon, dark sky, painful ending but new dawn"
  },
  {
    cardNumber: 60, name: "Page of Swords", nameKo: "소드 시종", arcana: "minor", suit: "swords",
    uprightMeaning: "호기심, 민첩함, 새로운 아이디어, 분석",
    reversedMeaning: "교활함, 험담, 경솔함",
    description: "소드 시종은 날카로운 지성과 호기심을 상징합니다. 바람 부는 언덕 위에서 검을 들고 서 있는 젊은이는 지적 탐구와 새로운 아이디어를 나타냅니다.",
    keywords: ["호기심", "지성", "민첩함", "분석", "새로운 아이디어"],
    imagePrompt: "Page of Swords tarot card, mystical art nouveau style, alert young figure on windy hill with raised sword, birds in sky, sharp intellect and curiosity, air element"
  },
  {
    cardNumber: 61, name: "Knight of Swords", nameKo: "소드 기사", arcana: "minor", suit: "swords",
    uprightMeaning: "야망, 행동, 충동, 용감함",
    reversedMeaning: "무모함, 성급함, 공격성",
    description: "소드 기사는 빠르고 결단력 있는 행동을 상징합니다. 폭풍 속을 질주하는 말 위에서 검을 높이 든 기사는 무서운 속도와 결단력을 나타냅니다.",
    keywords: ["야망", "행동", "결단력", "속도", "용감함"],
    imagePrompt: "Knight of Swords tarot card, mystical art nouveau style, armored knight charging on white horse, sword raised, stormy sky, birds flying, swift and decisive action"
  },
  {
    cardNumber: 62, name: "Queen of Swords", nameKo: "소드 여왕", arcana: "minor", suit: "swords",
    uprightMeaning: "독립적, 공정한 판단, 명확한 경계, 직접적",
    reversedMeaning: "차갑고 잔인함, 비판적, 고통",
    description: "소드 여왕은 날카로운 지성과 독립성을 상징합니다. 구름 위 왕좌에서 검을 들고 앉아 있는 여왕은 명확한 판단력과 독립적인 사고를 나타냅니다.",
    keywords: ["독립성", "명확성", "공정함", "지성", "직접성"],
    imagePrompt: "Queen of Swords tarot card, mystical art nouveau style, stern queen on cloud throne, raised sword, butterfly on crown, sharp intellect and independent judgment"
  },
  {
    cardNumber: 63, name: "King of Swords", nameKo: "소드 왕", arcana: "minor", suit: "swords",
    uprightMeaning: "지적 능력, 권위, 진실, 명확성, 윤리",
    reversedMeaning: "조작, 독재, 냉혹함",
    description: "소드 왕은 지적 권위와 윤리적 판단을 상징합니다. 왕좌에 앉아 검을 들고 있는 왕은 법과 진실에 기반한 지적 리더십을 나타냅니다.",
    keywords: ["지성", "권위", "진실", "윤리", "명확성"],
    imagePrompt: "King of Swords tarot card, mystical art nouveau style, authoritative king on throne, upright sword, butterfly and birds, intellectual authority and ethical judgment"
  },

  // ===== MINOR ARCANA - PENTACLES (64-77) =====
  {
    cardNumber: 64, name: "Ace of Pentacles", nameKo: "펜타클 에이스", arcana: "minor", suit: "pentacles",
    uprightMeaning: "새로운 금전적 기회, 번영, 풍요, 안정",
    reversedMeaning: "기회 상실, 낭비, 불안정",
    description: "펜타클 에이스는 물질적 풍요와 새로운 기회의 시작을 상징합니다. 구름에서 나온 손이 황금 펜타클을 들고 있으며, 아래에는 꽃이 만발한 정원이 펼쳐집니다.",
    keywords: ["번영", "새로운 기회", "풍요", "안정", "물질적 시작"],
    imagePrompt: "Ace of Pentacles tarot card, mystical art nouveau style, hand from cloud holding golden pentacle, lush garden with flowers, arch of roses, material abundance and opportunity"
  },
  {
    cardNumber: 65, name: "Two of Pentacles", nameKo: "펜타클 2", arcana: "minor", suit: "pentacles",
    uprightMeaning: "균형, 적응성, 우선순위, 시간 관리",
    reversedMeaning: "균형 상실, 과부하, 재정 관리 부족",
    description: "펜타클 2는 균형 잡기와 적응을 상징합니다. 두 개의 펜타클을 저글링하는 인물은 삶의 다양한 측면을 균형 있게 관리하는 능력을 나타냅니다.",
    keywords: ["균형", "적응", "우선순위", "시간 관리", "유연성"],
    imagePrompt: "Two of Pentacles tarot card, mystical art nouveau style, figure juggling two pentacles with infinity loop, ships on waves behind, balance and adaptability, earth element"
  },
  {
    cardNumber: 66, name: "Three of Pentacles", nameKo: "펜타클 3", arcana: "minor", suit: "swords",
    uprightMeaning: "팀워크, 협력, 기술, 학습",
    reversedMeaning: "불화, 협력 부족, 기술 부족",
    description: "펜타클 3은 협력과 기술을 상징합니다. 교회에서 건축가와 수도사들이 함께 작업하는 모습은 팀워크와 전문적 기술의 중요성을 나타냅니다.",
    keywords: ["팀워크", "협력", "기술", "학습", "장인 정신"],
    imagePrompt: "Three of Pentacles tarot card, mystical art nouveau style, craftsman in cathedral with two advisors, three pentacles in arch, skilled collaboration and mastery"
  },
  {
    cardNumber: 67, name: "Four of Pentacles", nameKo: "펜타클 4", arcana: "minor", suit: "pentacles",
    uprightMeaning: "안전, 통제, 보수주의, 안정",
    reversedMeaning: "탐욕, 물질주의, 집착, 인색함",
    description: "펜타클 4는 물질적 안전과 통제를 상징합니다. 네 개의 펜타클을 꼭 붙들고 있는 인물은 재정적 안정을 추구하지만 동시에 집착의 위험을 나타냅니다.",
    keywords: ["안전", "통제", "안정", "보수주의", "집착"],
    imagePrompt: "Four of Pentacles tarot card, mystical art nouveau style, figure clutching four pentacles tightly, city background, possessiveness and financial security, earth element"
  },
  {
    cardNumber: 68, name: "Five of Pentacles", nameKo: "펜타클 5", arcana: "minor", suit: "pentacles",
    uprightMeaning: "재정적 손실, 빈곤, 고립, 걱정",
    reversedMeaning: "회복, 개선, 도움 받기",
    description: "펜타클 5는 물질적 어려움과 고립을 상징합니다. 눈 속에서 교회 창문 앞을 지나가는 두 인물은 도움이 가까이 있지만 보지 못하는 상황을 나타냅니다.",
    keywords: ["빈곤", "고립", "걱정", "재정적 손실", "어려움"],
    imagePrompt: "Five of Pentacles tarot card, mystical art nouveau style, two poor figures in snow outside church window, stained glass with pentacles, hardship and isolation"
  },
  {
    cardNumber: 69, name: "Six of Pentacles", nameKo: "펜타클 6", arcana: "minor", suit: "pentacles",
    uprightMeaning: "관대함, 자선, 나눔, 공정성",
    reversedMeaning: "빚, 이기심, 일방적 관계",
    description: "펜타클 6은 관대함과 나눔을 상징합니다. 저울을 들고 가난한 사람들에게 동전을 나눠주는 부유한 인물은 공정한 나눔과 자선을 나타냅니다.",
    keywords: ["관대함", "나눔", "자선", "공정성", "균형"],
    imagePrompt: "Six of Pentacles tarot card, mystical art nouveau style, wealthy merchant with scales giving coins to kneeling beggars, generosity and fair distribution"
  },
  {
    cardNumber: 70, name: "Seven of Pentacles", nameKo: "펜타클 7", arcana: "minor", suit: "pentacles",
    uprightMeaning: "장기적 비전, 인내, 투자, 지속 가능성",
    reversedMeaning: "성급함, 노력 부족, 낮은 수익",
    description: "펜타클 7은 인내와 장기적 투자를 상징합니다. 자신의 작물을 바라보며 잠시 쉬는 농부는 노력의 결실을 기다리는 인내와 장기적 사고를 나타냅니다.",
    keywords: ["인내", "장기적 비전", "투자", "지속 가능성", "수확"],
    imagePrompt: "Seven of Pentacles tarot card, mystical art nouveau style, farmer pausing to assess growing plants with seven pentacles, contemplation and long-term investment"
  },
  {
    cardNumber: 71, name: "Eight of Pentacles", nameKo: "펜타클 8", arcana: "minor", suit: "pentacles",
    uprightMeaning: "견습, 반복, 기술, 장인 정신",
    reversedMeaning: "완벽주의, 동기 부족, 기술 부족",
    description: "펜타클 8은 기술 연마와 장인 정신을 상징합니다. 여덟 개의 펜타클을 조각하는 장인은 반복적인 연습과 헌신을 통한 기술 향상을 나타냅니다.",
    keywords: ["기술", "장인 정신", "연습", "헌신", "발전"],
    imagePrompt: "Eight of Pentacles tarot card, mystical art nouveau style, craftsman carving pentacles, eight coins on display, dedicated practice and skill development, mastery"
  },
  {
    cardNumber: 72, name: "Nine of Pentacles", nameKo: "펜타클 9", arcana: "minor", suit: "pentacles",
    uprightMeaning: "풍요, 독립, 자기 충족, 사치",
    reversedMeaning: "자기 가치 부족, 과로, 물질주의",
    description: "펜타클 9는 물질적 풍요와 독립을 상징합니다. 아름다운 정원에서 매를 손에 얹은 우아한 여인은 자기 충족적인 풍요와 세련된 삶을 나타냅니다.",
    keywords: ["풍요", "독립", "자기 충족", "사치", "우아함"],
    imagePrompt: "Nine of Pentacles tarot card, mystical art nouveau style, elegant woman in vineyard with falcon, nine pentacles, snail, abundance and self-sufficiency, refined luxury"
  },
  {
    cardNumber: 73, name: "Ten of Pentacles", nameKo: "펜타클 10", arcana: "minor", suit: "pentacles",
    uprightMeaning: "부, 재정적 안정, 가족, 장기적 성공",
    reversedMeaning: "재정적 실패, 고독, 가족 갈등",
    description: "펜타클 10은 물질적 완성과 세대를 이어가는 풍요를 상징합니다. 가족이 함께하는 모습과 열 개의 펜타클은 지속적인 번영과 안정을 나타냅니다.",
    keywords: ["부", "안정", "가족", "유산", "장기적 성공"],
    imagePrompt: "Ten of Pentacles tarot card, mystical art nouveau style, multi-generational family with dogs, ten pentacles in kabbalistic tree, archway, lasting wealth and legacy"
  },
  {
    cardNumber: 74, name: "Page of Pentacles", nameKo: "펜타클 시종", arcana: "minor", suit: "pentacles",
    uprightMeaning: "야망, 욕망, 새로운 기회, 목표 지향",
    reversedMeaning: "집중 부족, 게으름, 비현실적 목표",
    description: "펜타클 시종은 실용적이고 목표 지향적인 젊은 에너지를 상징합니다. 펜타클을 경이롭게 바라보는 젊은이는 물질적 목표를 향한 열망을 나타냅니다.",
    keywords: ["야망", "목표", "실용성", "학습", "기회"],
    imagePrompt: "Page of Pentacles tarot card, mystical art nouveau style, young figure gazing at glowing pentacle, green meadow, flowers, ambitious and practical earth energy"
  },
  {
    cardNumber: 75, name: "Knight of Pentacles", nameKo: "펜타클 기사", arcana: "minor", suit: "pentacles",
    uprightMeaning: "노력, 생산성, 루틴, 보수주의",
    reversedMeaning: "게으름, 자기 탐닉, 정체",
    description: "펜타클 기사는 꾸준한 노력과 신뢰성을 상징합니다. 정지된 말 위에서 펜타클을 바라보는 기사는 느리지만 확실한 진전과 책임감을 나타냅니다.",
    keywords: ["노력", "신뢰성", "인내", "루틴", "생산성"],
    imagePrompt: "Knight of Pentacles tarot card, mystical art nouveau style, methodical knight on stationary black horse, holding pentacle, plowed field, reliable and hardworking energy"
  },
  {
    cardNumber: 76, name: "Queen of Pentacles", nameKo: "펜타클 여왕", arcana: "minor", suit: "pentacles",
    uprightMeaning: "실용성, 야망, 양육, 신뢰성",
    reversedMeaning: "자기 중심적, 질투, 불안정",
    description: "펜타클 여왕은 풍요롭고 실용적인 여성 에너지를 상징합니다. 꽃이 만발한 정원에서 펜타클을 들고 앉아 있는 여왕은 양육과 실용적 지혜를 나타냅니다.",
    keywords: ["실용성", "양육", "풍요", "신뢰성", "자연"],
    imagePrompt: "Queen of Pentacles tarot card, mystical art nouveau style, nurturing queen on flower-adorned throne, pentacle in lap, rabbit at feet, lush garden, practical abundance"
  },
  {
    cardNumber: 77, name: "King of Pentacles", nameKo: "펜타클 왕", arcana: "minor", suit: "pentacles",
    uprightMeaning: "부, 사업, 리더십, 안정, 신뢰성",
    reversedMeaning: "완고함, 물질주의, 실패",
    description: "펜타클 왕은 물질적 성공과 실용적 리더십을 상징합니다. 포도나무와 황소로 장식된 왕좌에 앉아 있는 왕은 재정적 지혜와 안정적인 리더십을 나타냅니다.",
    keywords: ["부", "사업", "리더십", "안정", "성공"],
    imagePrompt: "King of Pentacles tarot card, mystical art nouveau style, prosperous king on bull-decorated throne, pentacle and scepter, vineyard, financial mastery and stable leadership"
  }
];

// Insert all cards using drizzle
for (const card of tarotCards) {
  await db.insert(tarotCardsTable).values({
    cardNumber: card.cardNumber,
    name: card.name,
    nameKo: card.nameKo,
    arcana: card.arcana,
    suit: card.suit,
    uprightMeaning: card.uprightMeaning,
    reversedMeaning: card.reversedMeaning,
    description: card.description,
    keywords: card.keywords,
    imagePrompt: card.imagePrompt,
  }).onDuplicateKeyUpdate({ set: { name: card.name } });
}

console.log(`✅ Seeded ${tarotCards.length} tarot cards`);
await connection.end();
