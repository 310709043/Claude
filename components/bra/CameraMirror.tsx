'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * 對鏡模式：開啟鏡頭當鏡子用，畫面上有一條水平參考線，
 * 幫使用者確認皮尺與地面平行。影像不錄製、不上傳，關閉時會釋放鏡頭。
 */
export default function CameraMirror() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [on, setOn] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 離開頁面或元件卸載時務必關掉鏡頭
  useEffect(() => {
    return () => stopTracks();
  }, []);

  function stopTracks() {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
  }

  async function open() {
    setError(null);

    if (typeof navigator === 'undefined' || !navigator.mediaDevices?.getUserMedia) {
      setError('這個瀏覽器不支援鏡頭，或網址不是 HTTPS（本機 localhost 除外）。');
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user' },
        audio: false,
      });
      streamRef.current = stream;
      setOn(true);
      // video 元素要等 setOn 之後才存在，所以在下一個 tick 掛上串流
      requestAnimationFrame(() => {
        if (videoRef.current) videoRef.current.srcObject = stream;
      });
    } catch (e) {
      const name = e instanceof DOMException ? e.name : '';
      if (name === 'NotAllowedError') {
        setError('鏡頭權限被拒絕了。請在網址列的權限設定裡允許使用鏡頭，再試一次。');
      } else if (name === 'NotFoundError' || name === 'OverconstrainedError') {
        setError('找不到可用的鏡頭。');
      } else {
        setError('開啟鏡頭失敗，請確認沒有其他程式正在使用鏡頭。');
      }
    }
  }

  function close() {
    stopTracks();
    if (videoRef.current) videoRef.current.srcObject = null;
    setOn(false);
  }

  return (
    <div className="mt-7 border-t border-stone-100 pt-6">
      {!on && (
        <button
          type="button"
          onClick={open}
          className="w-full rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-600 transition hover:bg-rose-100"
        >
          打開鏡頭當鏡子，確認皮尺有沒有歪
        </button>
      )}

      {on && (
        <div>
          <div className="relative overflow-hidden rounded-xl bg-stone-900">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="block w-full -scale-x-100"
            />
            {/* 水平參考線 */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-x-0 top-1/2 border-t-2 border-dashed border-rose-400"
            />
            <p className="pointer-events-none absolute inset-x-0 bottom-2 text-center text-xs text-white/80">
              讓皮尺與這條線平行
            </p>
          </div>

          <button
            type="button"
            onClick={close}
            className="mt-3 w-full rounded-xl border border-stone-200 px-4 py-2.5 text-sm font-medium text-stone-600 transition hover:bg-stone-50"
          >
            關閉鏡頭
          </button>
        </div>
      )}

      {error && <p className="mt-3 text-xs leading-relaxed text-red-600">{error}</p>}

      <p className="mt-3 text-xs leading-relaxed text-stone-400">
        影像只顯示在你的螢幕上，不會錄影、不會上傳，關閉後立即釋放鏡頭。
      </p>
    </div>
  );
}
