/**
 * RAF helper that auto-pauses when the document is hidden,
 * and respects prefers-reduced-motion (throttles to ~12 fps).
 */
export function runRaf(tick: (t: number) => void): () => void {
  let raf = 0;
  let paused = document.hidden;
  const reduced =
    typeof window !== 'undefined' &&
    window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  let last = 0;

  const loop = (t: number) => {
    if (paused) return;
    if (reduced && t - last < 80) {
      raf = requestAnimationFrame(loop);
      return;
    }
    last = t;
    tick(t);
    raf = requestAnimationFrame(loop);
  };

  const onVis = () => {
    paused = document.hidden;
    if (!paused) raf = requestAnimationFrame(loop);
  };

  document.addEventListener('visibilitychange', onVis);
  raf = requestAnimationFrame(loop);

  return () => {
    cancelAnimationFrame(raf);
    document.removeEventListener('visibilitychange', onVis);
  };
}
