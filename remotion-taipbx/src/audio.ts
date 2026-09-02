/**
 * ============================================================
 *  音軌接口（目前為無聲版，接口已完整預留）
 * ------------------------------------------------------------
 *  ★ 加入配樂的步驟：
 *     1. 把音檔放進  public/music.mp3
 *     2. 把 enabled 改成 true
 *     3. 需要對點時調整 offsetInFrames（正值＝音樂延後進場）
 *
 *  建議配樂風格（給音樂總監／選曲的方向）：
 *   ・類型：Cinematic Corporate Tech / Modern Orchestral Hybrid
 *   ・速度：92–100 BPM（每小節 ≈ 2.5 秒 @ 60fps ≈ 150 frames）
 *   ・結構：
 *       00:00–00:15  低頻脈動 + 稀疏合成音墊（配合開場提問）
 *       00:15–00:47  加入節奏element，張力漸升（三大關卡）
 *       00:47–01:20  節奏full，加入 arpeggio（六大技術，全片最密）
 *       01:20–01:43  情緒轉開闊，弦樂鋪底（五大產業）
 *       01:43–01:58  升華，加入銅管／合唱層（四大價值）
 *       01:58–02:00  一記重擊 + 殘響收尾（CTA）
 *   ・參考方向：Hans Zimmer 式極簡脈動 × 現代品牌廣告的乾淨混音
 *   ・避免：帶人聲、旋律過強會蓋過中文旁白空間
 *
 *  音效點位（SFX cue）已在 SFX_CUES 標好，可直接交給音效師。
 * ============================================================ */

export const AUDIO = {
  /** ← 放入 public/music.mp3 後改成 true */
  enabled: false,
  file: 'music.mp3',
  /** 主音量 0–1 */
  volume: 0.72,
  /** 音樂相對影片的起始偏移（frames），用於對齊第一個重拍 */
  offsetInFrames: 0,
  /** 開頭淡入／結尾淡出長度（frames） */
  fadeInFrames: 45,
  fadeOutFrames: 120,
} as const;

/**
 * 音效對點表 —— 每個時間點在畫面上都有一個明確的動作，
 * 交給音效師時可直接依此表放置 SFX。
 * 單位：frames @ 60fps（秒 = frame / 60）
 */
export const SFX_CUES: {frame: number; label: string; type: string}[] = [
  {frame: 0, label: '開場光刃劃過', type: 'whoosh / riser'},
  {frame: 21, label: '提問文字進場', type: 'soft impact'},
  {frame: 264, label: '品牌浮現', type: 'deep impact + reverb tail'},
  {frame: 516, label: '三大支柱展開', type: 'tick ×3'},
  {frame: 920, label: '→ 第 2 段 光刃轉場', type: 'sweep whoosh'},
  {frame: 1130, label: '關卡 01 光刃貫穿', type: 'metallic slash'},
  {frame: 1610, label: '關卡 02 光刃貫穿', type: 'metallic slash'},
  {frame: 2090, label: '關卡 03 光刃貫穿', type: 'metallic slash'},
  {frame: 2820, label: '→ 第 3 段 百葉轉場', type: 'shutter / mechanical'},
  {frame: 3030, label: '技術 01–06 逐項', type: 'digital tick ×6（每 255 frames）'},
  {frame: 4560, label: '六項匯聚', type: 'harmonic swell'},
  {frame: 4750, label: '→ 第 4 段 光圈變焦', type: 'boom + flash'},
  {frame: 4930, label: '產業 01–05 逐項', type: 'sharp cut ×5（每 210 frames）'},
  {frame: 6100, label: '→ 第 5 段 光刃轉場', type: 'sweep whoosh'},
  {frame: 6265, label: '四格價值落位', type: 'soft thud ×4'},
  {frame: 6925, label: '→ CTA 光圈變焦', type: 'final boom'},
  {frame: 7125, label: '收尾光暈', type: 'reverse cymbal + tail'},
];
