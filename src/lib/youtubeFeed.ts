export const INGRESSO_CHANNEL_ID = 'UC5XG4yYM-_DQ-3HPRuam76Q';

/** Featured video on the channel home (the one shown when you open @ingresso-com). */
export const INGRESSO_FEATURED_FALLBACK_ID = 'y80_2R-aPT0';

const FEATURED_ID_RE =
  /"channelVideoPlayerRenderer":\{"videoId":"([A-Za-z0-9_-]{11})"/;
const SHELF_VIDEO_RE =
  /"videoRenderer":\{"videoId":"([A-Za-z0-9_-]{11})"/g;
const ANY_VIDEO_RE = /"videoId":"([A-Za-z0-9_-]{11})"/g;

const pushUnique = (ids: string[], id?: string) => {
  if (id && !ids.includes(id)) ids.push(id);
};

const parseChannelVideoIds = (html: string, limit: number) => {
  const ids: string[] = [];
  pushUnique(ids, html.match(FEATURED_ID_RE)?.[1]);

  for (const match of html.matchAll(SHELF_VIDEO_RE)) {
    pushUnique(ids, match[1]);
    if (ids.length >= limit) return ids.slice(0, limit);
  }

  for (const match of html.matchAll(ANY_VIDEO_RE)) {
    pushUnique(ids, match[1]);
    if (ids.length >= limit) break;
  }

  return ids.slice(0, limit);
};

const HERO_STORE = 'plural.yt.hero.v1';
/** Homepage front video: re-check the channel featured clip every 20 days. */
export const HERO_VIDEO_TTL_MS = 20 * 24 * 60 * 60 * 1000;

type HeroStore = { id: string; at: number };

const readHeroStore = (): HeroStore | null => {
  try {
    const stored = JSON.parse(localStorage.getItem(HERO_STORE) ?? 'null') as HeroStore | null;
    if (!stored?.id) return null;
    return stored;
  } catch {
    return null;
  }
};

const writeHeroStore = (id: string) => {
  if (!id) return;
  try {
    localStorage.setItem(HERO_STORE, JSON.stringify({ id, at: Date.now() } satisfies HeroStore));
  } catch {
    /* quota / private mode */
  }
};

/** Last known front video, even if the 20-day window already expired. */
export const peekHeroVideoId = (): string =>
  readHeroStore()?.id ?? INGRESSO_FEATURED_FALLBACK_ID;

export const heroVideoRefreshDelayMs = (): number => {
  const stored = readHeroStore();
  if (!stored?.id) return 0;
  return Math.max(0, HERO_VIDEO_TTL_MS - (Date.now() - stored.at));
};

async function pullIngressoFeaturedVideoId(): Promise<string | null> {
  try {
    const response = await fetch(`/api/yt-channel/${encodeURIComponent('ingresso-com')}`);
    if (!response.ok) return null;
    return parseChannelVideoIds(await response.text(), 1)[0] ?? null;
  } catch {
    return null;
  }
}

/** Fetch the channel featured video and stamp a new 20-day window. */
export async function refreshHeroVideoId(): Promise<string> {
  const next = await pullIngressoFeaturedVideoId();
  if (next) {
    writeHeroStore(next);
    return next;
  }
  return peekHeroVideoId();
}

/**
 * Cached featured video while the 20-day window is valid.
 * When it expires (or on first visit), pull a fresh ID from @ingresso-com.
 */
export async function resolveHeroVideoId(): Promise<string> {
  if (heroVideoRefreshDelayMs() > 0) return peekHeroVideoId();
  return refreshHeroVideoId();
}

export async function fetchIngressoFeaturedVideoId(): Promise<string> {
  return resolveHeroVideoId();
}

export async function fetchPinnedChannelVideos(
  handles: string[],
  fallbackIds: string[],
  limit = 8
): Promise<string[]> {
  const mixChannels = handles.length >= 2;
  const batches = await Promise.all(
    handles.map(async handle => {
      try {
        const perChannel = mixChannels ? 3 : Math.max(1, limit);
        const response = await fetch(`/api/yt-channel/${encodeURIComponent(handle)}`);
        if (!response.ok) return [] as string[];
        return parseChannelVideoIds(await response.text(), perChannel);
      } catch {
        return [] as string[];
      }
    })
  );

  const ids: string[] = [];
  if (mixChannels) {
    const maxLen = Math.max(0, ...batches.map(batch => batch.length));
    for (let i = 0; i < maxLen; i += 1) {
      batches.forEach(batch => pushUnique(ids, batch[i]));
    }
  } else {
    batches.forEach(batch => batch.forEach(id => pushUnique(ids, id)));
  }

  if (ids.length < 3) {
    fallbackIds.forEach(id => pushUnique(ids, id));
  }

  return ids.slice(0, Math.max(limit, ids.length));
}

const PLAYLIST_STORE = 'plural.yt.playlists.v1';
const BAD_STORE = 'plural.yt.bad';
const PLAYLIST_TTL_MS = 12 * 60 * 60 * 1000;

const catalogPlaylistCache = new Map<string, Promise<string[]>>();
const catalogPlaylistMemory = new Map<string, string[]>();
const sessionBadIds = new Set<string>();

try {
  const stored = JSON.parse(sessionStorage.getItem(BAD_STORE) ?? '[]') as string[];
  stored.forEach(id => sessionBadIds.add(id));
} catch {
  /* private mode / parse */
}

type PlaylistStore = Record<string, { ids: string[]; at: number }>;

const playlistKey = (handles: string[], fallbackIds: string[]) =>
  `${handles.join('|')}::${fallbackIds.join(',')}`;

const readPlaylistStore = (): PlaylistStore => {
  try {
    return JSON.parse(localStorage.getItem(PLAYLIST_STORE) ?? '{}') as PlaylistStore;
  } catch {
    return {};
  }
};

const writePlaylistEntry = (key: string, ids: string[]) => {
  if (!ids.length) return;
  try {
    const store = readPlaylistStore();
    store[key] = { ids, at: Date.now() };
    localStorage.setItem(PLAYLIST_STORE, JSON.stringify(store));
  } catch {
    /* quota / private mode */
  }
};

const readPlaylistEntry = (key: string): string[] | null => {
  const entry = readPlaylistStore()[key];
  if (!entry?.ids?.length) return null;
  if (Date.now() - entry.at > PLAYLIST_TTL_MS) return null;
  return entry.ids;
};

export const youtubePoster = (id: string) =>
  `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;

export const prefetchYoutubePoster = (id?: string) => {
  if (!id || typeof Image === 'undefined') return;
  const image = new Image();
  image.referrerPolicy = 'no-referrer';
  image.decoding = 'async';
  image.src = youtubePoster(id);
};

export const markCatalogVideoBad = (id: string) => {
  if (!id || sessionBadIds.has(id)) return;
  sessionBadIds.add(id);
  try {
    sessionStorage.setItem(BAD_STORE, JSON.stringify([...sessionBadIds]));
  } catch {
    /* private mode */
  }
};

export const isCatalogVideoBad = (id: string) => sessionBadIds.has(id);

const usable = (ids: string[]) => ids.filter(id => id && !sessionBadIds.has(id));

/** Sync: memory → localStorage → fallbacks. First paint never waits on the network. */
export function peekCatalogPlaylist(handles: string[], fallbackIds: string[]) {
  const key = playlistKey(handles, fallbackIds);
  const memory = catalogPlaylistMemory.get(key);
  if (memory?.length) {
    const live = usable(memory);
    if (live.length) return live;
  }
  const stored = readPlaylistEntry(key);
  if (stored?.length) {
    catalogPlaylistMemory.set(key, stored);
    const live = usable(stored);
    if (live.length) return live;
  }
  return usable(fallbackIds);
}

export function fetchCatalogPlaylist(handles: string[], fallbackIds: string[]) {
  const key = playlistKey(handles, fallbackIds);
  const cached = catalogPlaylistCache.get(key);
  if (cached) return cached;

  const pending = fetchPinnedChannelVideos(handles, fallbackIds, 12)
    .then(ids => {
      const live = usable(ids.length ? ids : peekCatalogPlaylist(handles, fallbackIds));
      if (live.length) {
        catalogPlaylistMemory.set(key, live);
        writePlaylistEntry(key, live);
      }
      return live;
    })
    .catch(() => peekCatalogPlaylist(handles, fallbackIds));

  catalogPlaylistCache.set(key, pending);
  return pending;
}

export function warmupCatalogPlayback(
  cards: { handles: string[]; fallbackIds: string[] }[]
) {
  cards.forEach(card => {
    peekCatalogPlaylist(card.handles, card.fallbackIds)
      .slice(0, 2)
      .forEach(prefetchYoutubePoster);
    void fetchCatalogPlaylist(card.handles, card.fallbackIds);
  });
}

/** Skip intros/bumpers; `fraction` 0.5 starts at the middle. */
export const clipStartSeconds = (
  duration: number,
  clipLength = 4,
  fraction = 0.33
) => {
  if (!Number.isFinite(duration) || duration < 18) return 0;
  const minSkip = Math.min(40, duration * 0.28);
  const maxStart = Math.max(0, duration - clipLength - 2);
  return Math.min(Math.max(minSkip, duration * fraction), maxStart);
};
