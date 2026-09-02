import {Config} from '@remotion/cli/config';

/**
 * 4K / 60fps 電影級輸出設定
 * 影像品質優先：JPEG 品質拉滿，避免壓縮造成的漸層色帶（banding）
 */
Config.setVideoImageFormat('jpeg');
Config.setJpegQuality(100);
Config.setOverwriteOutput(true);
Config.setChromiumDisableWebSecurity(false);

// 4K 畫面 + 大量 filter/blur，單格渲染較久，放寬逾時
Config.setDelayRenderTimeoutInMilliseconds(120_000);

// H.264 高品質；如需更小檔案改用 npm run render:h265
Config.setCodec('h264');
Config.setCrf(16);

/**
 * 使用系統預裝的 Chromium（此開發容器無法下載 Remotion 自帶的 Headless Shell）。
 * 在你自己的機器上請刪除／註解這一段，讓 Remotion 自動下載官方版本，
 * 官方版本經過渲染一致性驗證，輸出最穩定。
 */
if (process.env.REMOTION_BROWSER_EXECUTABLE) {
  Config.setBrowserExecutable(process.env.REMOTION_BROWSER_EXECUTABLE);
}
