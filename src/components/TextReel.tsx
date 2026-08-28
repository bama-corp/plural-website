import { useEffect, useRef, useState, type ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export type TextReelItem = {
  id: string;
  label: string;
  content: ReactNode;
};

const STEP = 72;
const COMPACT_STEP = 64;
const SPIN_MS = 3600;
const HOLD_MS = 9000;

const wrapDelta = (index: number, active: number, total: number) => {
  let delta = index - active;
  const half = total / 2;
  if (delta > half) delta -= total;
  if (delta < -half) delta += total;
  return delta;
};

type TextReelProps = {
  items: TextReelItem[];
  enabled?: boolean;
  compact?: boolean;
  align?: 'center' | 'start';
};

const TextReel = ({
  items,
  enabled = true,
  compact = false,
  align = 'center',
}: TextReelProps) => {
  const count = items.length;
  const step = compact ? COMPACT_STEP : STEP;
  const [active, setActive] = useState(0);
  const [hovering, setHovering] = useState(false);
  const [held, setHeld] = useState(false);
  const holdTimer = useRef(0);
  const wheelLock = useRef(false);
  const touchY = useRef<number | null>(null);
  const reduced = useRef(false);
  const reelRef = useRef<HTMLDivElement>(null);
  const paused = hovering || held;

  const hold = () => {
    setHeld(true);
    window.clearTimeout(holdTimer.current);
    holdTimer.current = window.setTimeout(() => setHeld(false), HOLD_MS);
  };

  const go = (direction: -1 | 1) => {
    setActive(current => (current + direction + count) % count);
  };

  const select = (index: number) => {
    setActive(index);
    hold();
  };

  useEffect(() => {
    reduced.current = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;
    return () => window.clearTimeout(holdTimer.current);
  }, []);

  useEffect(() => {
    if (!enabled || paused || reduced.current || count < 2) return;
    const id = window.setInterval(() => go(1), SPIN_MS);
    return () => window.clearInterval(id);
  }, [enabled, paused, count]);

  useEffect(() => {
    const el = reelRef.current;
    if (!el) return;
    const onWheel = (event: WheelEvent) => {
      event.preventDefault();
      if (wheelLock.current) return;
      wheelLock.current = true;
      go(event.deltaY > 0 ? 1 : -1);
      hold();
      window.setTimeout(() => {
        wheelLock.current = false;
      }, 420);
    };
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, [count]);

  useEffect(() => {
    if (active >= count) setActive(0);
  }, [active, count]);

  const current = items[Math.min(active, count - 1)];
  if (!current) return null;

  const centered = align === 'center';

  return (
    <div>
      <div
        className={`mb-4 flex items-center gap-6 ${
          centered ? 'justify-center' : 'justify-start'
        }`}
      >
        <button
          type="button"
          aria-label="Anterior"
          className="px-2 text-2xl leading-none text-white/50 hover:text-white"
          onClick={() => {
            go(-1);
            hold();
          }}
        >
          ‹
        </button>
        <p className="section-kicker">
          {String(active + 1).padStart(2, '0')} /{' '}
          {String(count).padStart(2, '0')}
        </p>
        <button
          type="button"
          aria-label="Seguinte"
          className="px-2 text-2xl leading-none text-white/50 hover:text-white"
          onClick={() => {
            go(1);
            hold();
          }}
        >
          ›
        </button>
      </div>

      <div
        ref={reelRef}
        className={`faq-reel relative select-none ${
          compact ? 'h-[240px] sm:h-[260px]' : 'h-[300px] sm:h-[320px]'
        }`}
        onMouseEnter={() => setHovering(true)}
        onMouseLeave={() => setHovering(false)}
        onTouchStart={event => {
          touchY.current = event.touches[0].clientY;
        }}
        onTouchEnd={event => {
          if (touchY.current == null) return;
          const delta = event.changedTouches[0].clientY - touchY.current;
          touchY.current = null;
          if (Math.abs(delta) < 28) return;
          go(delta < 0 ? 1 : -1);
          hold();
        }}
      >
        {items.map((item, index) => {
          const delta = wrapDelta(index, active, count);
          const abs = Math.abs(delta);
          const isCenter = delta === 0;
          return (
            <button
              key={item.id}
              type="button"
              tabIndex={isCenter ? 0 : -1}
              aria-current={isCenter ? 'true' : undefined}
              onClick={() => select(index)}
              className={`absolute inset-x-0 top-1/2 w-full px-2 transition-[transform,opacity] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                centered ? 'text-center' : 'text-left'
              }`}
              style={{
                transform: `translateY(calc(-50% + ${delta * step}px))`,
                opacity:
                  abs === 0 ? 1 : abs === 1 ? 0.38 : abs === 2 ? 0.16 : 0,
                zIndex: 10 - abs,
                pointerEvents: abs > 2 ? 'none' : 'auto',
              }}
            >
              <span
                className={`block tracking-tight transition-[font-size,color] duration-500 ${
                  isCenter
                    ? compact
                      ? 'text-xl sm:text-2xl font-semibold text-white'
                      : 'text-2xl sm:text-4xl font-semibold text-white'
                    : compact
                      ? 'text-sm sm:text-base font-light text-white/70'
                      : 'text-base sm:text-xl font-light text-white/70'
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={current.id}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.28 }}
          className={`mt-8 max-w-2xl text-white/55 leading-relaxed ${
            centered ? 'mx-auto text-center' : ''
          }`}
        >
          {current.content}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default TextReel;
