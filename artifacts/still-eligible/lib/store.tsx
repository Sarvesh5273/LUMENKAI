import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { EMPTY_PROFILE, Opportunity, UserProfile } from './types';
import { OPPORTUNITIES } from '../data';
import bundledMeta from '../data/dataset-meta.json';
import { Dataset, DatasetSource, findNewIds, isNewerDataset, parseDataset } from './dataset';
import { DATASET_FETCH_TIMEOUT_MS, DATASET_URL } from './config';

interface StoreContextType {
  profile: UserProfile | null;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
  isProfileLoaded: boolean;

  trackedOppIds: string[];
  toggleTrackOpp: (id: string) => Promise<void>;
  isTracked: (id: string) => boolean;

  /** The records currently shown: bundled, cached or freshly fetched, whichever is newest. */
  records: Opportunity[];
  /** ISO timestamp of the export the records came from. */
  dataUpdatedAt: string;
  dataSource: DatasetSource;
  /** True while a fetch from the repo is in flight. */
  isRefreshingData: boolean;
  /** Fetch the latest dataset now. Safe to call repeatedly; failures leave the current records in place. */
  refreshDataset: () => Promise<void>;
  /** Ids that were not in the student's feed on their previous visit. */
  isNew: (id: string) => boolean;
  findRecord: (id: string) => Opportunity | undefined;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

const PROFILE_KEY = '@still_eligible_profile_v2';
const TRACKED_KEY = '@still_eligible_tracked';
const DATASET_KEY = '@still_eligible_dataset_v1';
const SEEN_KEY = '@still_eligible_seen_ids_v1';

const BUNDLED_DATASET: Dataset = {
  schema_version: bundledMeta.schema_version,
  generated_at: bundledMeta.generated_at,
  records: OPPORTUNITIES,
};

function parseStoredDataset(raw: string | null): Dataset | null {
  if (!raw) return null;
  try {
    const result = parseDataset(JSON.parse(raw));
    return result.ok ? result.dataset : null;
  } catch {
    return null;
  }
}

function parseStoredIds(raw: string | null): string[] | null {
  if (!raw) return null;
  try {
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((id): id is string => typeof id === 'string') : null;
  } catch {
    return null;
  }
}

async function fetchRemoteDataset(): Promise<{ raw: string; dataset: Dataset } | null> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), DATASET_FETCH_TIMEOUT_MS);
  try {
    const response = await fetch(DATASET_URL, { signal: controller.signal, headers: { accept: 'application/json' } });
    if (!response.ok) {
      // A 404 here means the repo has no commit with the file yet (or the branch moved).
      if (__DEV__) console.log(`Remote dataset not fetched: HTTP ${response.status} from ${DATASET_URL}`);
      return null;
    }
    const raw = await response.text();
    const result = parseDataset(JSON.parse(raw));
    if (!result.ok) {
      if (__DEV__) console.warn('Remote dataset rejected:', result.reason);
      return null;
    }
    return { raw, dataset: result.dataset };
  } catch (error) {
    // Offline, timed out, or the repo is not there yet. The current copy stays.
    if (__DEV__) console.log('Remote dataset not fetched:', error instanceof Error ? error.message : String(error));
    return null;
  } finally {
    clearTimeout(timer);
  }
}

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isProfileLoaded, setIsProfileLoaded] = useState(false);
  const [trackedOppIds, setTrackedOppIds] = useState<string[]>([]);

  const [dataset, setDataset] = useState<Dataset>(BUNDLED_DATASET);
  const [dataSource, setDataSource] = useState<DatasetSource>('bundled');
  const [isRefreshingData, setIsRefreshingData] = useState(false);
  const [newIds, setNewIds] = useState<Set<string>>(new Set());

  // The ids the student had seen before this session started. New ids are
  // always measured against this baseline, so a record that arrives by
  // fetch mid-session still counts as new until the next launch. On the very
  // first launch there is no previous visit, so nothing is new, including a
  // remote copy that lands a few seconds after the bundled one.
  const seenBaseline = useRef<Set<string> | null>(null);
  const isFirstLaunch = useRef(false);
  const datasetRef = useRef<Dataset>(BUNDLED_DATASET);
  const trackedRef = useRef<string[]>([]);
  const refreshInFlight = useRef<Promise<void> | null>(null);

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const persistTracked = useCallback(async (ids: string[]) => {
    trackedRef.current = ids;
    setTrackedOppIds(ids);
    await AsyncStorage.setItem(TRACKED_KEY, JSON.stringify(ids));
  }, []);

  /**
   * Make `next` the active dataset. Everything that depends on the set of
   * record ids happens here, whichever copy is being adopted: the New
   * markers, the seen baseline, and dropping tracked ids whose record no
   * longer exists.
   */
  const adoptDataset = useCallback(
    async (next: Dataset, source: DatasetSource) => {
      datasetRef.current = next;
      setDataset(next);
      setDataSource(source);

      const currentIds = next.records.map((r) => r.id);
      const baseline = seenBaseline.current;
      if (baseline === null || isFirstLaunch.current) {
        // First ever launch: nothing is "new", everything is the starting point.
        isFirstLaunch.current = true;
        const merged = new Set([...(baseline ?? []), ...currentIds]);
        seenBaseline.current = merged;
        await AsyncStorage.setItem(SEEN_KEY, JSON.stringify(Array.from(merged)));
      } else {
        const fresh = findNewIds(next, baseline);
        if (fresh.length > 0) {
          setNewIds((prev) => new Set([...prev, ...fresh]));
        }
        const merged = Array.from(new Set([...baseline, ...currentIds]));
        if (merged.length !== baseline.size) {
          await AsyncStorage.setItem(SEEN_KEY, JSON.stringify(merged));
        }
      }

      const known = new Set(currentIds);
      const kept = trackedRef.current.filter((id) => known.has(id));
      if (kept.length !== trackedRef.current.length) {
        await persistTracked(kept);
      }
    },
    [persistTracked],
  );

  const refreshDataset = useCallback(async () => {
    if (refreshInFlight.current) return refreshInFlight.current;
    const run = (async () => {
      setIsRefreshingData(true);
      try {
        const remote = await fetchRemoteDataset();
        if (remote) {
          const currentAt = datasetRef.current.generated_at;
          const newer = isNewerDataset(remote.dataset, datasetRef.current);
          if (newer) {
            await AsyncStorage.setItem(DATASET_KEY, remote.raw);
            await adoptDataset(remote.dataset, 'remote');
          }
          // Logged after the adopt step so "adopted" is only ever printed once
          // it has actually happened; a failure inside it lands in the catch below.
          if (__DEV__) {
            console.log(
              `Remote dataset fetched: generated_at ${remote.dataset.generated_at}, ${remote.dataset.records.length} records, ` +
                (newer ? 'adopted' : `not newer than the current copy (${currentAt}), keeping that`),
            );
          }
        }
      } catch (e) {
        console.error('Failed to refresh dataset: fetched copy was not adopted', e);
      } finally {
        setIsRefreshingData(false);
        refreshInFlight.current = null;
      }
    })();
    refreshInFlight.current = run;
    return run;
  }, [adoptDataset]);

  const loadData = async () => {
    try {
      const [profileData, trackedData, cachedData, seenData] = await Promise.all([
        AsyncStorage.getItem(PROFILE_KEY),
        AsyncStorage.getItem(TRACKED_KEY),
        AsyncStorage.getItem(DATASET_KEY),
        AsyncStorage.getItem(SEEN_KEY),
      ]);

      if (profileData) {
        // Fill any key a stored profile lacks with null, so the engine never
        // sees undefined and mistakes it for a value that passes a cutoff.
        setProfile({ ...EMPTY_PROFILE, ...JSON.parse(profileData) });
      }

      // The stored tracked list, minus junk and duplicates. adoptDataset
      // drops the ids whose record is not in the active copy.
      const storedTracked = parseStoredIds(trackedData);
      if (storedTracked) {
        const deduped = Array.from(new Set(storedTracked));
        trackedRef.current = deduped;
        setTrackedOppIds(deduped);
        if (deduped.length !== storedTracked.length) {
          await AsyncStorage.setItem(TRACKED_KEY, JSON.stringify(deduped));
        }
      }

      // Newest valid copy wins. The bundled copy is the floor.
      const cached = parseStoredDataset(cachedData);
      let active = BUNDLED_DATASET;
      let source: DatasetSource = 'bundled';
      if (cached && isNewerDataset(cached, BUNDLED_DATASET)) {
        active = cached;
        source = 'cached';
      } else if (cachedData) {
        // Stale or unreadable cache: drop it so it is not parsed on every launch.
        await AsyncStorage.removeItem(DATASET_KEY);
      }

      const storedSeen = parseStoredIds(seenData);
      seenBaseline.current = storedSeen ? new Set(storedSeen) : null;
      await adoptDataset(active, source);
    } catch (e) {
      console.error('Failed to load store data', e);
    } finally {
      setIsProfileLoaded(true);
    }
    // Do not hold the app on the network: the feed shows the local copy
    // immediately and swaps in newer data when it lands.
    void refreshDataset();
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    try {
      const updatedProfile: UserProfile = { ...EMPTY_PROFILE, ...profile, ...updates };
      setProfile(updatedProfile);
      await AsyncStorage.setItem(PROFILE_KEY, JSON.stringify(updatedProfile));
    } catch (e) {
      console.error('Failed to save profile', e);
      throw e;
    }
  };

  const toggleTrackOpp = async (id: string) => {
    try {
      const current = trackedRef.current;
      const newTracked = current.includes(id) ? current.filter((t) => t !== id) : [...current, id];
      await persistTracked(newTracked);
    } catch (e) {
      console.error('Failed to save tracked opps', e);
      throw e;
    }
  };

  const isTracked = (id: string) => trackedOppIds.includes(id);

  const byId = useMemo(() => new Map(dataset.records.map((record) => [record.id, record])), [dataset]);
  const findRecord = useCallback((id: string) => byId.get(id), [byId]);
  const isNew = useCallback((id: string) => newIds.has(id), [newIds]);

  return (
    <StoreContext.Provider
      value={{
        profile,
        updateProfile,
        isProfileLoaded,
        trackedOppIds,
        toggleTrackOpp,
        isTracked,
        records: dataset.records,
        dataUpdatedAt: dataset.generated_at,
        dataSource,
        isRefreshingData,
        refreshDataset,
        isNew,
        findRecord,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);
  if (context === undefined) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
}
