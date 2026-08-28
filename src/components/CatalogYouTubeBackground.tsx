import { useEffect, useRef, useState } from 'react';
import {
  clipStartSeconds,
  fetchCatalogPlaylist,
  markCatalogVideoBad,
  peekCatalogPlaylist,
  youtubePoster,
} from '../lib/youtubeFeed';
import {
  loadYouTubeApi,
  playbackStartDelay,
  YT_BUFFERING,
  YT_CUED,
  YT_ENDED,
  YT_PAUSED,
  YT_PLAYING,
  YT_UNSTARTED,
  type YTPlayer,
  type YTNamespace,
} from '../lib/youtubeApi';

const FADE_MS = 280;
const STUCK_MS = 1_600;

type CatalogYouTubeBackgroundProps = {
  handles: string[];
  fallbackIds: string[];
  startFraction?: number;
  clipSeconds?: number;
  lightCover?: boolean;
  color?: boolean;
};

type Slot = {
  player: YTPlayer | null;
  videoIndex: number;
  ready: boolean;
  ticking: boolean;
};

const unlockAutoplay = (player: YTPlayer) => {
  const iframe = player.getIframe?.();
  if (!iframe) return;
  iframe.setAttribute(
    'allow',
    'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'
  );
  iframe.setAttribute('playsinline', '1');
  iframe.setAttribute('webkit-playsinline', '1');
  iframe.setAttribute('allowfullscreen', '0');
};

const deadTitle = (title?: string) => {
  const t = (title ?? '').toLowerCase();
  return (
    t.includes('unavailable') ||
    t.includes('indispon') ||
    t.includes('not available') ||
    t.includes('não está disponível') ||
    t.includes('private') ||
    t.includes('removed')
  );
};

const CatalogYouTubeBackground = ({
  handles,
  fallbackIds,
  startFraction = 0.33,
  clipSeconds = 4,
  lightCover = false,
  color = false,
}: CatalogYouTubeBackgroundProps) => {
  const frameRef = useRef<HTMLDivElement>(null);
  const mountA = useRef<HTMLDivElement>(null);
  const mountB = useRef<HTMLDivElement>(null);
  const [front, setFront] = useState<0 | 1>(0);
  const [onAir, setOnAir] = useState(false);
  const bootStart = startFraction <= 0 ? 0 : startFraction >= 0.45 ? 40 : 22;
  const posterId = peekCatalogPlaylist(handles, fallbackIds)[0];

  useEffect(() => {
    const frame = frameRef.current;
    if (!frame || !mountA.current || !mountB.current) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let cancelled = false;
    let started = false;
    let api: YTNamespace | null = null;
    let ids: string[] = peekCatalogPlaylist(handles, fallbackIds);
    if (!ids.length) ids = fallbackIds.filter(Boolean);
    let active: 0 | 1 = 0;
    let clipTimer = 0;
    let retryTimer = 0;
    let watchTimer = 0;
    let startTimer = 0;
    const stuckTimer = [0, 0];
    const bad = new Set<string>();
    const slots: [Slot, Slot] = [
      { player: null, videoIndex: -1, ready: false, ticking: false },
      { player: null, videoIndex: -1, ready: false, ticking: false },
    ];

    const otherOf = (slot: 0 | 1): 0 | 1 => (slot === 0 ? 1 : 0);

    const cover = () => {
      if (!cancelled) setOnAir(false);
    };

    const clearClip = () => {
      window.clearTimeout(clipTimer);
      window.clearTimeout(retryTimer);
      clipTimer = 0;
      retryTimer = 0;
    };

    const expectedId = (slot: 0 | 1) => {
      const i = slots[slot].videoIndex;
      return i >= 0 ? ids[i] : undefined;
    };

    const isHealthy = (slot: 0 | 1) => {
      const player = slots[slot].player;
      const want = expectedId(slot);
      if (!player || !want) return false;
      try {
        const state = player.getPlayerState?.();
        if (state !== YT_PLAYING && state !== YT_BUFFERING) return false;
        const data = player.getVideoData?.() ?? {};
        if (deadTitle(data.title)) return false;
        if (data.video_id && data.video_id !== want) return false;
        return true;
      } catch {
        return false;
      }
    };

    const nextPlayable = (from: number) => {
      if (!ids.length) return -1;
      for (let step = 1; step <= ids.length; step += 1) {
        const i = (from + step) % ids.length;
        if (!bad.has(ids[i])) return i;
      }
      return -1;
    };

    const ensureSecondPlayer = () => {
      if (ids.length < 2 || slots[1].player || !api || !mountB.current) return;
      const second = nextPlayable(slots[0].videoIndex);
      if (second >= 0 && second !== slots[0].videoIndex) {
        attach(1, mountB.current, second);
      }
    };

    const prefetchHidden = () => {
      if (ids.length < 2) return;
      ensureSecondPlayer();
      const hidden = otherOf(active);
      const nxt = nextPlayable(slots[active].videoIndex);
      if (nxt < 0 || nxt === slots[active].videoIndex) return;
      if (slots[hidden].videoIndex === nxt && slots[hidden].ready) return;
      loadSlot(hidden, nxt);
    };

    const beginClipClock = () => {
      if (ids.length < 2) return;
      window.clearTimeout(clipTimer);
      clipTimer = window.setTimeout(trySwap, clipSeconds * 1000);
      prefetchHidden();
    };

    const restartSolo = (player: YTPlayer) => {
      const duration = player.getDuration();
      player.seekTo(clipStartSeconds(duration, clipSeconds, startFraction), true);
      player.mute();
      player.playVideo();
    };

    const trySwap = () => {
      if (cancelled) return;
      if (ids.length === 1 && slots[active].player) {
        restartSolo(slots[active].player);
        return;
      }
      const hidden = otherOf(active);
      if (slots[hidden].ready && slots[hidden].player && isHealthy(hidden)) {
        slots[active].ticking = false;
        active = hidden;
        setFront(hidden);
        slots[hidden].ticking = false;
        slots[hidden].player?.mute();
        slots[hidden].player?.playVideo();
        return;
      }
      const nxt = nextPlayable(slots[active].videoIndex);
      if (nxt < 0) {
        if (!isHealthy(active)) cover();
        return;
      }
      prefetchHidden();
      window.clearTimeout(retryTimer);
      retryTimer = window.setTimeout(trySwap, 350);
    };

    const reject = (slot: 0 | 1) => {
      const failed = expectedId(slot);
      if (slot !== active && failed && failed === expectedId(active)) {
        slots[slot].ready = false;
        slots[slot].ticking = false;
        return;
      }
      if (failed) {
        bad.add(failed);
        markCatalogVideoBad(failed);
      }
      slots[slot].ready = false;
      slots[slot].ticking = false;
      const nxt = nextPlayable(slots[slot].videoIndex);
      if (nxt < 0) {
        if (slot === active) {
          bad.delete(failed ?? '');
          if (ids.length === 1 && slots[slot].player) {
            restartSolo(slots[slot].player);
            return;
          }
          cover();
        }
        return;
      }
      if (slot === active) cover();
      loadSlot(slot, nxt);
    };

    const loadSlot = (slot: 0 | 1, videoIndex: number) => {
      const player = slots[slot].player;
      const id = ids[videoIndex];
      if (!player || videoIndex < 0 || !id || cancelled) return;
      if (bad.has(id)) {
        const nxt = nextPlayable(videoIndex);
        if (nxt >= 0 && nxt !== videoIndex) loadSlot(slot, nxt);
        return;
      }

      slots[slot].videoIndex = videoIndex;
      slots[slot].ready = false;
      slots[slot].ticking = false;
      window.clearTimeout(stuckTimer[slot]);
      stuckTimer[slot] = window.setTimeout(() => {
        if (cancelled || slots[slot].ready) return;
        if (ids.length === 1) {
          slots[slot].player?.mute();
          slots[slot].player?.playVideo();
          return;
        }
        reject(slot);
      }, STUCK_MS);

      try {
        player.mute();
        player.loadVideoById({
          videoId: id,
          startSeconds: bootStart,
        });
      } catch {
        reject(slot);
      }
    };

    const onSlotReady = (slot: 0 | 1) => {
      if (!isHealthy(slot)) {
        reject(slot);
        return;
      }
      slots[slot].ready = true;
      window.clearTimeout(stuckTimer[slot]);
      if (slot !== active) return;
      if (!cancelled) setOnAir(true);
      ensureSecondPlayer();
      if (slots[slot].ticking) return;
      slots[slot].ticking = true;
      beginClipClock();
    };

    const attach = (slot: 0 | 1, element: HTMLElement, videoIndex: number) => {
      if (!api) return;
      slots[slot].videoIndex = videoIndex;
      slots[slot].player = new api.Player(element, {
        width: '100%',
        height: '100%',
        videoId: ids[videoIndex],
        playerVars: {
          autoplay: 1,
          mute: 1,
          controls: 0,
          modestbranding: 1,
          rel: 0,
          playsinline: 1,
          enablejsapi: 1,
          fs: 0,
          disablekb: 1,
          iv_load_policy: 3,
          cc_load_policy: 0,
          start: bootStart,
          origin: window.location.origin,
        },
        events: {
          onReady: event => {
            unlockAutoplay(event.target);
            event.target.mute();
            event.target.playVideo();
          },
          onError: () => {
            if (ids.length === 1) {
              slots[slot].player?.mute();
              slots[slot].player?.playVideo();
              return;
            }
            reject(slot);
          },
          onStateChange: event => {
            if (event.data === YT_ENDED && ids.length === 1) {
              restartSolo(event.target);
              return;
            }
            if (
              event.data === YT_UNSTARTED ||
              event.data === YT_CUED ||
              event.data === YT_ENDED
            ) {
              if (ids.length === 1) return;
              if (slots[slot].ready || slot === active) {
                const data = event.target.getVideoData?.();
                if (deadTitle(data?.title) || (event.data === YT_ENDED && ids.length > 1)) {
                  if (event.data !== YT_ENDED || !slots[slot].ticking) reject(slot);
                }
              }
              return;
            }
            if (event.data !== YT_PLAYING) return;
            event.target.mute();
            const data = event.target.getVideoData?.();
            const want = expectedId(slot);
            if (deadTitle(data?.title) || (data?.video_id && want && data.video_id !== want)) {
              reject(slot);
              return;
            }
            onSlotReady(slot);
          },
        },
      });
    };

    const setup = async () => {
      if (started || cancelled || !mountA.current || !mountB.current) return;
      started = true;

      api = await loadYouTubeApi();
      if (cancelled || !mountA.current || !mountB.current || !ids.length) return;

      const begin = () => {
        if (cancelled || !mountA.current) return;
        attach(0, mountA.current, 0);

        watchTimer = window.setInterval(() => {
          if (cancelled) return;
          try {
            const player = slots[active].player;
            if (!player) return;
            const state = player.getPlayerState?.();
            if (
              state === YT_PAUSED ||
              state === YT_UNSTARTED ||
              state === YT_CUED
            ) {
              player.mute();
              player.playVideo();
              return;
            }
            if (state === YT_BUFFERING) return;
            if (state === YT_PLAYING && ids.length === 1) return;
            const data = player.getVideoData?.();
            if (deadTitle(data?.title)) {
              reject(active);
              return;
            }
            if (ids.length === 1) return;
            if (slots[active].ready && !isHealthy(active)) reject(active);
          } catch {
            /* player not ready yet */
          }
        }, 400);

        if (!handles.length) return;
        void fetchCatalogPlaylist(handles, fallbackIds).then(fetched => {
          if (cancelled || !fetched.length) return;
          const nextIds = fetched.filter(id => !bad.has(id));
          if (nextIds.length) ids = nextIds;
        });
      };

      const wait = playbackStartDelay();
      if (wait) startTimer = window.setTimeout(begin, wait);
      else begin();
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          void setup();
          slots[active].player?.mute();
          slots[active].player?.playVideo();
        }
      },
      { threshold: 0, rootMargin: '80% 0px' }
    );

    observer.observe(frame);
    void setup();

    return () => {
      cancelled = true;
      clearClip();
      window.clearTimeout(startTimer);
      window.clearTimeout(stuckTimer[0]);
      window.clearTimeout(stuckTimer[1]);
      window.clearInterval(watchTimer);
      observer.disconnect();
      slots[0].player?.destroy();
      slots[1].player?.destroy();
    };
  }, [handles, fallbackIds, startFraction, clipSeconds, bootStart]);

  return (
    <div
      ref={frameRef}
      className="catalog-yt absolute inset-0 z-0 overflow-hidden"
      aria-hidden="true"
    >
      <div
        className={`absolute left-1/2 top-1/2 pointer-events-none ${
          color ? '' : 'grayscale contrast-110 brightness-110'
        }`}
        style={{
          width: 1280,
          height: 720,
          minWidth: '100%',
          minHeight: '100%',
          transform: 'translate(-50%, -50%) scale(1.5)',
        }}
      >
        {[0, 1].map(slot => (
          <div
            key={slot}
            className="absolute inset-0 transition-opacity ease-in-out"
            style={{
              opacity: front === slot ? 1 : 0,
              transitionDuration: `${FADE_MS}ms`,
            }}
          >
            <div ref={slot === 0 ? mountA : mountB} className="h-full w-full" />
          </div>
        ))}
      </div>
      <div
        className={`absolute inset-0 z-10 pointer-events-none overflow-hidden transition-opacity duration-200 ${
          onAir ? 'opacity-0' : 'opacity-100'
        } ${posterId ? '' : lightCover ? 'bg-white' : 'bg-[#0a0a0a]'}`}
      >
        {posterId ? (
          <img
            src={youtubePoster(posterId)}
            alt=""
            className="absolute inset-0 h-full w-full scale-110 object-cover grayscale contrast-110 brightness-110"
            referrerPolicy="no-referrer"
            decoding="async"
          />
        ) : null}
        <div
          className={`absolute inset-0 ${
            lightCover ? 'bg-white/70' : 'bg-black/45'
          }`}
        />
      </div>
    </div>
  );
};

export default CatalogYouTubeBackground;
