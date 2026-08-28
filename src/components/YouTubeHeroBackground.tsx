import { useEffect, useRef, useState } from 'react';
import { fetchIngressoFeaturedVideoId } from '../lib/youtubeFeed';
import heroFallback from '../assets/videos/hero.webm';

type YTPlayer = {
  playVideo: () => void;
  pauseVideo: () => void;
  mute: () => void;
  destroy: () => void;
};

type YTNamespace = {
  Player: new (
    element: HTMLElement,
    options: {
      width: string | number;
      height: string | number;
      videoId?: string;
      playerVars?: Record<string, string | number>;
      events?: {
        onReady?: (event: { target: YTPlayer }) => void;
        onStateChange?: (event: { data: number; target: YTPlayer }) => void;
      };
    }
  ) => YTPlayer;
};

declare global {
  interface Window {
    YT?: YTNamespace;
    onYouTubeIframeAPIReady?: () => void;
  }
}

const YT_ENDED = 0;
const YT_PLAYING = 1;

const loadYouTubeApi = () =>
  new Promise<YTNamespace>(resolve => {
    if (window.YT?.Player) {
      resolve(window.YT);
      return;
    }

    const previous = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      previous?.();
      if (window.YT) resolve(window.YT);
    };

    if (!document.querySelector('script[src="https://www.youtube.com/iframe_api"]')) {
      const script = document.createElement('script');
      script.src = 'https://www.youtube.com/iframe_api';
      script.async = true;
      document.head.appendChild(script);
    }
  });

const YouTubeHeroBackground = () => {
  const frameRef = useRef<HTMLDivElement>(null);
  const mountRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<YTPlayer | null>(null);
  const [youtubeReady, setYoutubeReady] = useState(false);

  useEffect(() => {
    const mount = mountRef.current;
    const frame = frameRef.current;
    if (!mount || !frame) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    let cancelled = false;
    let observer: IntersectionObserver | undefined;

    const setup = async () => {
      const videoId = await fetchIngressoFeaturedVideoId();
      if (cancelled || !mountRef.current) return;

      const YT = await loadYouTubeApi();
      if (cancelled || !mountRef.current) return;

      const player = new YT.Player(mountRef.current, {
        width: '100%',
        height: '100%',
        videoId,
        playerVars: {
          autoplay: 1,
          mute: 1,
          controls: 0,
          modestbranding: 1,
          rel: 0,
          playsinline: 1,
          loop: 1,
          playlist: videoId,
          fs: 0,
          disablekb: 1,
          iv_load_policy: 3,
          cc_load_policy: 0,
          origin: window.location.origin,
        },
        events: {
          onReady: event => {
            event.target.mute();
            event.target.playVideo();
          },
          onStateChange: event => {
            if (event.data === YT_PLAYING) {
              setYoutubeReady(true);
            }
            if (event.data === YT_ENDED) {
              event.target.playVideo();
            }
          },
        },
      });

      if (cancelled) {
        player.destroy();
        return;
      }

      playerRef.current = player;

      observer = new IntersectionObserver(
        ([entry]) => {
          if (!playerRef.current) return;
          if (entry.isIntersecting) playerRef.current.playVideo();
          else playerRef.current.pauseVideo();
        },
        { threshold: 0.2 }
      );

      observer.observe(frame);
    };

    setup();

    return () => {
      cancelled = true;
      observer?.disconnect();
      playerRef.current?.destroy();
      playerRef.current = null;
    };
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
      {!youtubeReady && (
        <video
          className="absolute inset-0 h-full w-full object-cover scale-105 grayscale contrast-110 brightness-110"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
        >
          <source src={heroFallback} type="video/webm" />
        </video>
      )}

      <div
        ref={frameRef}
        className="absolute left-1/2 top-1/2 pointer-events-none grayscale contrast-110 brightness-110"
        style={{
          width: '177.78vh',
          height: '56.25vw',
          minWidth: '100%',
          minHeight: '100%',
          transform: 'translate(-50%, -50%) scale(1.35)',
        }}
      >
        <div ref={mountRef} className="h-full w-full" />
      </div>
    </div>
  );
};

export default YouTubeHeroBackground;
