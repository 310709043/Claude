# TAIPBX Call Center — 介紹影片（Remotion）

以合作夥伴的新版簡報（8 頁）為腳本，用
[Remotion](https://remotion.dev) 產製的 1920×1080 / 30fps 介紹影片，全長約 **86 秒**。

- 品牌：台灣大哥大（台灣大哥大 企業服務）標誌與品牌橘 `#FF7300`
- 背景：暖白／淺灰漸層畫布（**非黑底**），搭配品牌色柔光、細格線與紙質噪點；
  開場與結尾引入簡報主視覺——黑白建築攝影上切過的橘色斜面
- 平台畫面：簡報內的實機截圖（AI Agent 值機、AI 助理建置），加上指向 UI 實際位置的動態標註

> 前一版影片（依 TAIPBX Call Center 簡報製作、81.5 秒）保留在 git 歷史
> `d0eae27`，`git checkout d0eae27` 即可取回。

## 快速開始

```bash
npm install
npm run dev      # Remotion Studio 預覽
npm run render   # 輸出 out/taipbx-callcenter-intro.mp4（走 Node API，見 scripts/render.mjs）
npx remotion still src/index.ts TaipbxIntro out/frame.png --frame=800
```

## 影片結構

| # | 場景 | 簡報頁 | 檔案 | 長度 |
|---|------|--------|------|------|
| 1 | 品牌開場 | — | `S1Logo.tsx` | 108f |
| 2 | TAIPBX Call Center（主視覺） | P1 | `S2Title.tsx` | 186f |
| 3 | 化解企業 AI 導入的三大關卡（痛點→解法翻牌） | P2 | `S3Barriers.tsx` | 336f |
| 4 | 六大核心技術能力（主機示意圖逐項點亮） | P3 | `S4Platform.tsx` | 432f |
| 5 | 橫跨五大產業的全場景 AI 賦能 | P4 | `S5Industries.tsx` | 336f |
| 6 | 多 AI Agent 值機介面（通話中 → 通話結束兩個節拍） | P5 | `S6AgentUI.tsx` | 432f |
| 7 | no code 建置企業專屬 AI 助理（3 幅畫面） | P6–P7 | `S7NoCode.tsx` | 360f |
| 8 | 一次投資，長期增值 | P8 | `S8Value.tsx` | 306f |
| 9 | 結尾 | — | `S9Outro.tsx` | 186f |

場景之間重疊 14 格做交叉溶接，總長由 `src/Video.tsx` 的 `SCENES` 自動推算。

## 目錄

```
src/
  Video.tsx          # 時間軸組裝、進度軸
  Root.tsx           # Composition 設定（1920×1080 / 30fps）
  theme.ts           # 色票、字體堆疊
  anim.ts            # 進場／退場、彈跳、包絡等動畫工具
  fonts.ts           # 內嵌字型載入（render 期間完全不碰網路）
  fontData.ts        # 由 scripts/embed-fonts.mjs 產生，勿手改
  components/
    Backdrop.tsx     # 全片共用的淺色動態背景
    Brand.tsx        # 台灣大哥大標誌元件
    Layout.tsx       # Scene／Stage／Kicker／SceneTitle／Card
    Screen.tsx       # 產品截圖外框（含各截圖原生比例表 SHOTS）
    Callout.tsx      # 指向 UI 實際位置的動態標註
  scenes/            # 九個場景
scripts/
  extract-deck.py    # 盤點 .pptx：逐頁文字 + 媒體尺寸與引用頁
  rebrand-shots.py   # 截圖去舊品牌、補台灣大標誌（前一份簡報用）
  embed-fonts.mjs    # 將 public/fonts/*.woff2 內嵌成 base64
public/
  brand/             # 標誌（本份簡報自帶含 alpha 的 450px 版本）
  ui/                # 平台截圖
  icons/             # 五大產業圖示（簡報內的 SVG）
  photo/             # 簡報主視覺（開場／結尾）
  fonts/             # Noto Sans TC + Inter，subset 至本片用字
```

## 素材處理

- **標誌**：直接使用簡報內含 alpha 的 `台灣大哥大 企業服務` 鎖定版（image17）；
  拆成球標與字樣，字樣另產生深色版供淺底使用。球標以保留切面邊緣的方式放大。
- **平台截圖**：
  - `ai-agent`（P5 主畫面）表頭已是台灣大品牌；狀態列的「AICC-X 客服系統」以
    文字段落切分自動定位後改為「TAIPBX 客服系統」。
  - `nocode-urls`／`nocode-url-add`／`kb-files`（P6–P7）原帶知識庫平台的舊品牌
    （左上角標誌、右上角帳號、側欄「關聯對話平台」四列、解析器欄十列），
    共 14 處，均以該處底色補平後改為台灣大球標 + `TAIPBX`。前一份簡報的注記曾要求
    該產品命名中性化，這裡沿用同一原則；若正式命名不同，換掉 `public/ui/` 同名檔即可。
  - `ai-summary`／`ai-qa-live`／`ai-qa-report` 為 P5 的三張局部放大圖，
    用於「通話結束」節拍，未改動。
- **動態標註**：簡報用紅框箭頭標出畫面重點，影片改成即時繪出——
  游標環落在被說明的控制項上、引線畫出、標籤最後到位。落點座標寫在各場景的
  `callouts`，刻意選在該截圖確實留白的區域。
- **字型**：Remotion render 會同時開多個瀏覽器分頁，且把 `setTimeout` 接到時間軸而非
  真實時鐘，字型請求一旦卡住便無從逾時；因此字型以 base64 內嵌、直接餵給
  `FontFace` 的 ArrayBuffer。**改動任何中文文案後務必重跑 subset 與
  `node scripts/embed-fonts.mjs`**，否則新字會以系統備用字型呈現。

## 換簡報時的流程

1. `python3 scripts/extract-deck.py deck.pptx --out media/` 取得逐頁文字與媒體清單
2. 挑選截圖、處理品牌 → `public/ui/`；更新 `Screen.tsx` 的 `SHOTS` 比例表
3. 改寫 `src/scenes/*`，在 `Video.tsx` 調整 `SCENES` 長度
4. 重跑字型 subset + `embed-fonts.mjs`
5. `npx remotion still` 逐場景檢查，再 `npm run render`

> 產品名稱一律為 **TAIPBX Call Center**；簡報中的「一體機／單機」用語已依客戶要求移除。

## 字幕與旁白

`src/captions.ts` 是字幕與旁白的**單一來源**：22 句、以 30fps 的格數對齊各場景，
沒有任何一句跨越剪接點。

```bash
node scripts/make-subtitles.mjs   # 產生 subtitles/ 並檢查語速
```

產出三個檔案：

| 檔案 | 用途 |
|------|------|
| `subtitles/taipbx-callcenter.zh-TW.srt` | YouTube／一般播放器外掛字幕 |
| `subtitles/taipbx-callcenter.zh-TW.vtt` | 網頁 `<track>` |
| `subtitles/narration-zh-TW.md` | 旁白稿，含每句進出點、可用秒數與估計秒數 |

產生器會以每秒 4.5 個中文字的沉穩語速估算每句需時，超出畫面留給它的秒數就報錯，
避免出現唸不完的字幕。

兩個 composition：`TaipbxIntro`（乾淨母版）與 `TaipbxIntroSubtitled`（字幕燒錄版）。

```bash
node scripts/render.mjs out/film.mp4 3 TaipbxIntroSubtitled
```

**旁白配音**：本環境沒有可用的 TTS——未安裝任何語音引擎，且
`speech.platform.bing.com`、`translate.google.com`、ElevenLabs、HuggingFace
均被 agent proxy 阻擋。`narration-zh-TW.md` 已按秒數寫好，可直接交給配音員或
外部 TTS 服務錄製；錄好的音軌對齊進點後用 ffmpeg 併入即可。

### 配音音軌組裝

`scripts/mux-voiceover.mjs` 把旁白疊回影片，兩種輸入形態對應兩種取得配音的方式：

```bash
# 22 個分句音檔（TTS 逐句產生）——依 captions.ts 的進點逐一定位
node scripts/mux-voiceover.mjs clips out/vo/ out/taipbx-callcenter-intro.mp4 out/film-vo.mp4

# 一整條已對好時間的音軌（配音員對著 guide track 錄）——從 0 秒鋪下去
node scripts/mux-voiceover.mjs track out/narration.wav out/taipbx-callcenter-intro.mp4 out/film-vo.mp4
```

兩者都會把人聲正規化到 **-16 LUFS**（網路影片常用值），影片流直接 copy 不重壓。

`scripts/make-guide-track.mjs` 產生 `subtitles/recording-guide.wav`：85.7 秒的靜音軌，
在每句進點放一個提示音（換段落時音高提高）。配音員戴耳機聽著它錄，就能準確踩點。

管線已用 22 段合成音檔實測：輸出 2570 格未被裁切，22 段語音對齊 22 句字幕，
**最大偏差 0.000 秒**。

> 注意：`apad` 若不給 `whole_dur` 會產生無限音流，`-shortest` 從 filter graph 後方
> 無法可靠終止它，ffmpeg 會卡死；因此腳本先以 ffprobe 讀出影片長度再明確收尾。
