import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserProfile } from './types';

interface StoreContextType {
  profile: UserProfile | null;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
  isProfileLoaded: boolean;
  
  trackedOppIds: string[];
  toggleTrackOpp: (id: string) => Promise<void>;
  isTracked: (id: string) => boolean;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

const PROFILE_KEY = '@still_eligible_profile';
const TRACKED_KEY = '@still_eligible_tracked';

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isProfileLoaded, setIsProfileLoaded] = useState(false);
  const [trackedOppIds, setTrackedOppIds] = useState<string[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [profileData, trackedData] = await Promise.all([
        AsyncStorage.getItem(PROFILE_KEY),
        AsyncStorage.getItem(TRACKED_KEY)
      ]);
      
      if (profileData) {
        setProfile(JSON.parse(profileData));
      }
      
      if (trackedData) {
        setTrackedOppIds(JSON.parse(trackedData));
      }
    } catch (e) {
      console.error('Failed to load store data', e);
    } finally {
      setIsProfileLoaded(true);
    }
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    try {
      const updatedProfile = { ...profile, ...updates } as UserProfile;
      setProfile(updatedProfile);
      await AsyncStorage.setItem(PROFILE_KEY, JSON.stringify(updatedProfile));
    } catch (e) {
      console.error('Failed to save profile', e);
      throw e;
    }
  };

  const toggleTrackOpp = async (id: string) => {
    try {
      let newTracked: string[];
      if (trackedOppIds.includes(id)) {
        newTracked = trackedOppIds.filter(t => t !== id);
      } else {
        newTracked = [...trackedOppIds, id];
      }
      setTrackedOppIds(newTracked);
      await AsyncStorage.setItem(TRACKED_KEY, JSON.stringify(newTracked));
    } catch (e) {
      console.error('Failed to save tracked opps', e);
      throw e;
    }
  };

  const isTracked = (id: string) => trackedOppIds.includes(id);

  return (
    <StoreContext.Provider value={{
      profile,
      updateProfile,
      isProfileLoaded,
      trackedOppIds,
      toggleTrackOpp,
      isTracked
    }}>
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
