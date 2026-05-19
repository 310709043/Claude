/* i18n — zh/en/ko/ja string tables + tFor helper. Ported from i18n.jsx. */

import type { Lang } from '@/components/ThemeProvider';

type StrValue = string | ((n: number) => string);
type Entry = Partial<Record<Lang, StrValue>>;

export const LANGS: Lang[] = ['zh', 'en', 'ko', 'ja'];
export const LANG_LABEL: Record<Lang, string> = { zh: '中文', en: 'EN', ko: '한국', ja: '日本' };
export const LANG_FULL: Record<Lang, string> = {
  zh: '中文',
  en: 'English',
  ko: '한국어',
  ja: '日本語',
};

export const STR: Record<string, Entry> = {
  appName: { zh: 'LOW BATTERY TOWN', en: 'LOW BATTERY TOWN', ko: 'LOW BATTERY TOWN', ja: 'LOW BATTERY TOWN' },
  tagline: {
    zh: '充電中的城市 · 找你的人 · 找你的專注',
    en: 'A city charging up · Find your people, your focus',
    ko: '충전 중인 도시 · 당신의 사람들, 당신의 집중',
    ja: '充電中の街 · 仲間と集中を見つける',
  },
  onlineCount: {
    zh: (n: number) => `${n} 名鎮民正在專注 ▼`,
    en: (n: number) => `${n} citizens are focusing ▼`,
    ko: (n: number) => `${n} 명의 시민이 집중 중 ▼`,
    ja: (n: number) => `${n} 名の住民が集中中 ▼`,
  },
  focusingNow: { zh: '專注中', en: 'FOCUSING', ko: '집중 중', ja: '集中中' },
  sameRoom: {
    zh: (n: number) => `${n} 人同你一起`,
    en: (n: number) => `${n} with you`,
    ko: (n: number) => `${n} 명과 함께`,
    ja: (n: number) => `${n} 名と一緒に`,
  },
  signInTitle: { zh: '進入小鎮', en: 'Enter the Town', ko: '마을로 입장', ja: '町に入る' },
  signInSub: { zh: '專注，從找到一群人開始', en: 'Focus starts with finding your people', ko: '집중은 사람들로부터', ja: '集中は仲間から' },
  email: { zh: '電子郵件', en: 'Email', ko: '이메일', ja: 'メール' },
  password: { zh: '密碼', en: 'Password', ko: '비밀번호', ja: 'パスワード' },
  rememberMe: { zh: '記住我', en: 'Remember me', ko: '로그인 유지', ja: 'ログイン保持' },
  forgot: { zh: '忘記密碼？', en: 'Forgot password?', ko: '비밀번호 찾기', ja: 'パスワードを忘れた' },
  signIn: { zh: '登入', en: 'Sign in', ko: '로그인', ja: 'ログイン' },
  enterTown: { zh: '進入小鎮 ▶', en: 'Enter Town ▶', ko: '입장 ▶', ja: '入場 ▶' },
  or: { zh: '或', en: 'OR', ko: '또는', ja: 'または' },
  continueWithGoogle: { zh: '使用 Google 繼續', en: 'Continue with Google', ko: 'Google로 계속', ja: 'Google で続行' },
  continueWithApple: { zh: '使用 Apple 繼續', en: 'Continue with Apple', ko: 'Apple로 계속', ja: 'Apple で続行' },
  continueWithGithub: { zh: '使用 GitHub 繼續', en: 'Continue with GitHub', ko: 'GitHub로 계속', ja: 'GitHub で続行' },
  newHere: { zh: '第一次來？', en: 'First time here?', ko: '처음이신가요?', ja: 'はじめてですか？' },
  createAcc: { zh: '建立帳號', en: 'Create account', ko: '계정 만들기', ja: 'アカウント作成' },
  haveAcc: { zh: '已有帳號？', en: 'Have an account?', ko: '이미 계정이 있나요?', ja: 'アカウントをお持ち？' },
  backToSignin: { zh: '回到登入', en: 'Back to sign in', ko: '로그인으로', ja: 'ログインへ' },
  signupTitle: { zh: '建立帳號', en: 'Create your account', ko: '계정 만들기', ja: 'アカウントを作成' },
  confirmPw: { zh: '確認密碼', en: 'Confirm password', ko: '비밀번호 확인', ja: 'パスワード確認' },
  agreeToTos: {
    zh: '我同意 服務條款 與 隱私政策',
    en: 'I agree to the Terms and Privacy Policy',
    ko: '이용약관 및 개인정보 정책에 동의합니다',
    ja: '利用規約とプライバシーポリシーに同意します',
  },
  next: { zh: '下一步 ▶', en: 'Next ▶', ko: '다음 ▶', ja: '次へ ▶' },

  regTitle: { zh: '建立你的鎮民', en: 'Create your citizen', ko: '시민 만들기', ja: '住民を作成' },
  nickname: { zh: '稱呼', en: 'Display name', ko: '닉네임', ja: '呼び名' },
  nicknameHint: { zh: '別人會這樣叫你', en: 'How others see you', ko: '다른 사람이 부르는 이름', ja: '他の人が呼ぶ名前' },
  role: { zh: '選擇角色', en: 'Choose your role', ko: '캐릭터 선택', ja: 'キャラクターを選択' },
  roleSub: { zh: '32 種職業身份', en: '32 character classes', ko: '32 가지 직업', ja: '32 種の職業' },
  age: { zh: '年齡', en: 'Age', ko: '나이', ja: '年齢' },
  interests: { zh: '興趣', en: 'Interests', ko: '관심사', ja: '興味' },
  interestsSub: { zh: '可多選 · 越多越容易找到夥伴', en: 'Pick a few — more = better matches', ko: '여러 개 선택 가능', ja: '複数選択可' },
  skills: { zh: '專長', en: 'Skills', ko: '전문분야', ja: '得意分野' },
  skillsSub: { zh: '可多選', en: 'Pick a few', ko: '여러 개 선택', ja: '複数選択可' },
  dailyGoal: { zh: '每日目標', en: 'Daily goal', ko: '하루 목표', ja: '一日の目標' },
  pomos: { zh: '顆番茄', en: 'pomodoros', ko: '뽀모도로', ja: 'ポモドーロ' },
  enterTownBtn: { zh: '✦ 完成 · 進入小鎮', en: '✦ Finish · Enter Town', ko: '✦ 완료 · 입장', ja: '✦ 完了 · 入場' },
  step: { zh: '步驟', en: 'STEP', ko: '단계', ja: 'ステップ' },

  weatherSunny: { zh: '晴朗', en: 'CLEAR', ko: '맑음', ja: '晴れ' },
  weatherCloudy: { zh: '多雲', en: 'CLOUDY', ko: '흐림', ja: '曇り' },
  weatherRain: { zh: '雨', en: 'RAIN', ko: '비', ja: '雨' },
  weatherSnow: { zh: '雪', en: 'SNOW', ko: '눈', ja: '雪' },
  weatherStorm: { zh: '雷雨', en: 'STORM', ko: '폭풍', ja: '雷雨' },
  timeDawn: { zh: '黎明', en: 'DAWN', ko: '새벽', ja: '夜明け' },
  timeDay: { zh: '白天', en: 'DAY', ko: '낮', ja: '昼' },
  timeDusk: { zh: '黃昏', en: 'DUSK', ko: '황혼', ja: '夕暮れ' },
  timeNight: { zh: '夜晚', en: 'NIGHT', ko: '밤', ja: '夜' },
  timeMidnight: { zh: '深夜', en: 'MIDNIGHT', ko: '심야', ja: '深夜' },

  tcoin: { zh: 'T 幣', en: 'T-COIN', ko: 'T 코인', ja: 'T コイン' },
  citizens: { zh: '鎮民', en: 'Citizens', ko: '시민', ja: '住民' },
  todayRank: { zh: '今日專注排行', en: "Today's Focus Rank", ko: '오늘의 집중 랭킹', ja: '今日の集中ランク' },
  findBuddy: { zh: '找夥伴', en: 'Find Buddy', ko: '동료 찾기', ja: '相棒を探す' },
  soloFocus: { zh: '個人專注', en: 'Solo Focus', ko: '혼자 집중', ja: '一人で集中' },
  studyHall: { zh: '自習教室', en: 'Study Hall', ko: '독서실', ja: '自習室' },
  cafe: { zh: '咖啡館', en: 'Cafe', ko: '카페', ja: 'カフェ' },
  arcade: { zh: '電玩館', en: 'Arcade', ko: '오락실', ja: 'アーケード' },
  lofiBar: { zh: 'lofi 酒吧', en: 'lofi Bar', ko: 'lofi 바', ja: 'lofi バー' },
  inkStore: { zh: '文具店', en: 'Ink Store', ko: '문구점', ja: '文具店' },
  ramen: { zh: '貓拉麵', en: 'Neko Ramen', ko: '고양이 라멘', ja: '猫ラーメン' },
  library: { zh: '圖書館', en: 'Library', ko: '도서관', ja: '図書館' },
  coworking: { zh: '共享空間', en: 'Co-working', ko: '코워킹', ja: 'コワーキング' },
  gallery: { zh: '畫廊', en: 'Gallery', ko: '갤러리', ja: 'ギャラリー' },
  plaza: { zh: '中央廣場', en: 'Plaza', ko: '광장', ja: '広場' },

  buddyRoom: { zh: '夥伴房間', en: 'Buddy Room', ko: '동료의 방', ja: '相棒ルーム' },
  sameFocus: { zh: '一起專注中', en: 'Focusing together', ko: '함께 집중 중', ja: '一緒に集中中' },
  sharedNotes: { zh: '共筆與聊天', en: 'Notes & Chat', ko: '노트 & 채팅', ja: 'ノート＆チャット' },
  typeMsg: { zh: '輸入訊息或筆記...', en: 'Type a message or note...', ko: '메시지 또는 노트 입력...', ja: 'メッセージかノートを入力...' },
  leaveRoom: { zh: '離開房間', en: 'Leave room', ko: '방 나가기', ja: '退室' },

  soloRoom: { zh: '個人專注室', en: 'Solo Focus Room', ko: '개인 집중실', ja: '個人集中ルーム' },
  myNotes: { zh: '個人筆記', en: 'My Notes', ko: '내 노트', ja: 'マイノート' },
  tasks: { zh: '任務清單', en: 'Tasks', ko: '할 일', ja: 'タスク' },
  musicTip: { zh: 'lofi · 已連線', en: 'lofi · connected', ko: 'lofi · 연결됨', ja: 'lofi · 接続済' },
  addTask: { zh: '+ 新任務', en: '+ Add task', ko: '+ 작업 추가', ja: '+ タスク追加' },
  background: { zh: '背景場景', en: 'Background', ko: '배경', ja: '背景' },

  skyAd: { zh: '本週主打', en: 'Featured', ko: '이번 주', ja: '今週の注目' },

  shopTitle: { zh: '道具商店', en: 'Item Shop', ko: '아이템 상점', ja: 'アイテムショップ' },
  achievementsTitle: { zh: '大冒險 · 成就', en: 'Achievements', ko: '업적', ja: '実績' },
  friendsTitle: { zh: '楔報好友', en: 'Friends', ko: '친구', ja: 'フレンド' },
  close: { zh: '關閉', en: 'CLOSE', ko: '닫기', ja: '閉じる' },
  back: { zh: '返回', en: 'BACK', ko: '뒤로', ja: '戻る' },

  start: { zh: '開始', en: 'Start', ko: '시작', ja: '開始' },
  pause: { zh: '暫停', en: 'Pause', ko: '일시정지', ja: '一時停止' },
  skip: { zh: '跳過', en: 'Skip', ko: '건너뛰기', ja: 'スキップ' },
  reset: { zh: '重置', en: 'Reset', ko: '재설정', ja: 'リセット' },

  langName: { zh: '中文', en: 'English', ko: '한국어', ja: '日本語' },

  region: { zh: '所在地區', en: 'Region', ko: '지역', ja: '地域' },
  regionSub: { zh: '幫你找到附近的鎮民', en: 'Find nearby citizens', ko: '근처 시민 찾기', ja: '近くの住民を探す' },
  ageLockedHint: { zh: '註冊後不可修改', en: 'Cannot change after signup', ko: '가입 후 변경 불가', ja: '登録後は変更不可' },
  profile: { zh: '個人主頁', en: 'My Profile', ko: '내 프로필', ja: 'マイプロフィール' },
  myStats: { zh: '我的數據', en: 'My Stats', ko: '내 통계', ja: '統計' },
  myNotesArchive: { zh: '筆記庫', en: 'Notes Archive', ko: '노트 아카이브', ja: 'ノート一覧' },
  myFriends: { zh: '好友', en: 'Friends', ko: '친구', ja: 'フレンド' },
  logout: { zh: '登出', en: 'Log out', ko: '로그아웃', ja: 'ログアウト' },
  feedback: { zh: '意見反饋', en: 'Feedback', ko: '의견', ja: 'フィードバック' },
  support: { zh: '客服中心', en: 'Support', ko: '고객 지원', ja: 'サポート' },
  settings: { zh: '設定', en: 'Settings', ko: '설정', ja: '設定' },
  edit: { zh: '編輯', en: 'Edit', ko: '편집', ja: '編集' },
  save: { zh: '儲存', en: 'Save', ko: '저장', ja: '保存' },
  cancel: { zh: '取消', en: 'Cancel', ko: '취소', ja: 'キャンセル' },
  send: { zh: '送出', en: 'Send', ko: '전송', ja: '送信' },
  status: { zh: '狀態', en: 'Status', ko: '상태', ja: 'ステータス' },
  streak: { zh: '連續', en: 'Streak', ko: '연속', ja: '連続' },
  totalFocus: { zh: '累計專注', en: 'Total focus', ko: '총 집중', ja: '総集中' },
  todayFocus: { zh: '今日專注', en: "Today's focus", ko: '오늘 집중', ja: '今日の集中' },
  weekRank: { zh: '本週排名', en: 'Week rank', ko: '주간 순위', ja: '今週順位' },
};

export function tFor(lang: Lang) {
  return function t(key: string, arg?: number): string {
    const entry = STR[key];
    if (!entry) return key;
    const v = entry[lang] ?? entry.en ?? entry.zh;
    if (typeof v === 'function') return v(arg ?? 0);
    return (v as string) ?? key;
  };
}

export type TFn = ReturnType<typeof tFor>;
