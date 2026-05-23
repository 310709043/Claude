// Design tokens extracted directly from the Nocturne · 夜訊 prototype.
export const C = {
  bg: "#08070d",
  bg2: "#0c0a16",
  bg3: "#13101f",
  ink: "#ede9ff",
  ink2: "#c9c4e0",
  sub: "#8e89ac",
  faint: "#544f6e",
  muted: "#332e4a",
  card: "rgba(255,255,255,0.05)",
  card2: "rgba(255,255,255,0.08)",
  cardB: "rgba(255,255,255,0.12)",
  line: "rgba(255,255,255,0.10)",
  ember: "#ff8a6b",
  emberSoft: "#ffb89a",
  glow: "#5ee7c9",
  glowSoft: "#9df0de",
  danger: "#ff4d5e",
  warn: "#ffb86b",
  // five intent-tier colors (s0..s4)
  s0: "#6c7be0",
  s1: "#9b8cc4",
  s2: "#5ee7c9",
  s3: "#ffb86b",
  s4: "#ff8a6b",
} as const;

// Easing curves taken from the prototype.
export const EASE = [0.32, 0.72, 0, 1] as const;
export const EASE_SNAP = [0.2, 0.9, 0.3, 1] as const;
export const EASE_SPRING = [0.34, 1.56, 0.64, 1] as const;

// Five intent tiers — verbatim copy from the prototype.
export const TIERS = [
  {
    id: 0,
    color: C.s0,
    title: "只想一個人",
    desc: "我只想一個人，但想知道不是只有我",
    rule: "你會出現在地圖上，但別人不能傳訊息給你。",
  },
  {
    id: 1,
    color: C.s1,
    title: "在，但不想說話",
    desc: "我在，但現在不想說話",
    rule: "別人看得到你，只能對你說「我也在」。",
  },
  {
    id: 2,
    color: C.s2,
    title: "可以聊，不要約",
    desc: "可以打字聊，但不要約我出來",
    rule: "別人可以開始一段匿名文字。",
  },
  {
    id: 3,
    color: C.s3,
    title: "想找人說話",
    desc: "今晚有點想找人說話",
    rule: "別人可以傳訊息或約語音。",
  },
  {
    id: 4,
    color: C.s4,
    title: "想一起做點什麼",
    desc: "散步、便利店、看日出",
    rule: "別人可以聊、語音，或約現實見面。",
  },
] as const;

export const FPS = 30;
export const W = 1080;
export const H = 1920;
