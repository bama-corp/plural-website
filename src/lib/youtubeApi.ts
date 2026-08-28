type YTPlayer = {
  playVideo: () => void;
  pauseVideo: () => void;
  mute: () => void;
  destroy: () => void;
  loadVideoById: (opts: string | { videoId: string; startSeconds?: number }) => void;
  cueVideoById: (opts: string | { videoId: string; startSeconds?: number }) => void;
  seekTo: (seconds: number, allowSeekAhead: boolean) => void;
  getDuration: () => number;
  getCurrentTime: () => number;
  getPlayerState: () => number;
  getVideoData: () => { video_id?: string; title?: string };
  getIframe?: () => HTMLIFrameElement;
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
        onError?: (event: { data: number; target: YTPlayer }) => void;
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

export type { YTPlayer, YTNamespace };

export const YT_UNSTARTED = -1;
export const YT_ENDED = 0;
export const YT_PLAYING = 1;
export const YT_PAUSED = 2;
export const YT_BUFFERING = 3;
export const YT_CUED = 5;

let loading: Promise<YTNamespace> | null = null;
let startLane = 0;
let startLaneReset = 0;

export const loadYouTubeApi = () => {
  if (window.YT?.Player) return Promise.resolve(window.YT);
  if (loading) return loading;

  loading = new Promise<YTNamespace>(resolve => {
    let settled = false;
    const finish = () => {
      if (settled || !window.YT?.Player) return;
      settled = true;
      window.clearInterval(poll);
      resolve(window.YT);
    };

    const previous = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      previous?.();
      finish();
    };

    if (!document.querySelector('script[src="https://www.youtube.com/iframe_api"]')) {
      const script = document.createElement('script');
      script.src = 'https://www.youtube.com/iframe_api';
      script.async = true;
      document.head.appendChild(script);
    }

    const poll = window.setInterval(finish, 40);
  });

  return loading;
};

export const preloadYouTubeApi = () => {
  void loadYouTubeApi();
};

/** Stagger iframe creation so six cards do not boot at the same instant. */
export const playbackStartDelay = () => {
  window.clearTimeout(startLaneReset);
  startLaneReset = window.setTimeout(() => {
    startLane = 0;
  }, 4_000);
  const lane = startLane;
  startLane += 1;
  return lane * 90;
};
