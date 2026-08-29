import { useEffect, useRef, useState } from 'react';

const MIN_THUMB = 56;

const readMetrics = (trackHeight: number) => {
  const root = document.documentElement;
  const view = root.clientHeight;
  const total = root.scrollHeight;
  const maxScroll = Math.max(0, total - view);
  if (maxScroll < 2 || trackHeight < 2) {
    return { visible: false, thumbH: 0, thumbT: 0, maxScroll: 0 };
  }
  const thumbH = Math.max(MIN_THUMB, (view / total) * trackHeight);
  const maxTop = trackHeight - thumbH;
  const thumbT = (root.scrollTop / maxScroll) * maxTop;
  return { visible: true, thumbH, thumbT, maxScroll };
};

const PluralScrollbar = () => {
  const trackRef = useRef<HTMLDivElement>(null);
  const drag = useRef<{ startY: number; startTop: number } | null>(null);
  const [enabled, setEnabled] = useState(false);
  const [metrics, setMetrics] = useState({
    visible: false,
    thumbH: MIN_THUMB,
    thumbT: 0,
    maxScroll: 0,
  });

  const sync = () => {
    const track = trackRef.current;
    if (!track) return;
    setMetrics(readMetrics(track.clientHeight));
  };

  useEffect(() => {
    const media = window.matchMedia('(hover: hover) and (pointer: fine)');
    const apply = () => setEnabled(media.matches);
    apply();
    media.addEventListener('change', apply);
    return () => media.removeEventListener('change', apply);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    if (enabled) root.classList.add('plural-scroll');
    else root.classList.remove('plural-scroll');
    return () => root.classList.remove('plural-scroll');
  }, [enabled]);

  useEffect(() => {
    if (!enabled) return;
    sync();
    const onScroll = () => {
      if (drag.current) return;
      sync();
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', sync);
    const observer = new ResizeObserver(sync);
    observer.observe(document.documentElement);
    if (document.body) observer.observe(document.body);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', sync);
      observer.disconnect();
    };
  }, [enabled]);

  const scrollFromThumb = (thumbT: number) => {
    const track = trackRef.current;
    if (!track || metrics.maxScroll <= 0) return;
    const maxTop = track.clientHeight - metrics.thumbH;
    const next = Math.min(Math.max(thumbT, 0), maxTop);
    const ratio = maxTop <= 0 ? 0 : next / maxTop;
    document.documentElement.scrollTop = ratio * metrics.maxScroll;
    setMetrics(current => ({ ...current, thumbT: next }));
  };

  const onThumbPointerDown = (event: React.PointerEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
    drag.current = { startY: event.clientY, startTop: metrics.thumbT };
  };

  const onThumbPointerMove = (event: React.PointerEvent<HTMLButtonElement>) => {
    if (!drag.current) return;
    scrollFromThumb(
      drag.current.startTop + (event.clientY - drag.current.startY)
    );
  };

  const endDrag = () => {
    drag.current = null;
    sync();
  };

  const onTrackPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.target !== event.currentTarget) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    const y = event.clientY - bounds.top - metrics.thumbH / 2;
    scrollFromThumb(y);
  };

  if (!enabled) return null;

  const ratio =
    metrics.maxScroll <= 0
      ? 0
      : metrics.thumbT /
        Math.max(1, (trackRef.current?.clientHeight ?? 1) - metrics.thumbH);

  return (
    <div
      ref={trackRef}
      className="plural-scroll-track"
      onPointerDown={onTrackPointerDown}
      aria-hidden={!metrics.visible}
    >
      {metrics.visible ? (
        <button
          type="button"
          aria-label="Barra de deslocamento"
          role="scrollbar"
          aria-orientation="vertical"
          aria-controls="root"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(ratio * 100)}
          className="plural-scroll-thumb"
          style={{
            height: metrics.thumbH,
            transform: `translate(-50%, ${metrics.thumbT}px)`,
          }}
          onPointerDown={onThumbPointerDown}
          onPointerMove={onThumbPointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
        />
      ) : null}
    </div>
  );
};

export default PluralScrollbar;
