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

export async function fetchIngressoFeaturedVideoId(): Promise<string> {
  const ids = await fetchPinnedChannelVideos(['ingresso-com'], [INGRESSO_FEATURED_FALLBACK_ID], 1);
  return ids[0] ?? INGRESSO_FEATURED_FALLBACK_ID;
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
