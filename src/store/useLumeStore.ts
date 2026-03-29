import { create } from 'zustand';

interface LumeState {
  isSyncing: boolean;
  lastSyncTime: Date | null;
  triggerManualSync: () => void;
  setSyncStatus: (isSyncing: boolean, time?: Date) => void;
}

export const useLumeStore = create<LumeState>((set) => ({
  isSyncing: false,
  lastSyncTime: null,
  triggerManualSync: () => {
    set({ isSyncing: true });
    // This mocks an API/Health Connect invocation
    setTimeout(() => {
      set({ isSyncing: false, lastSyncTime: new Date() });
    }, 1500);
  },
  setSyncStatus: (isSyncing, time) => 
    set((state) => ({ 
      isSyncing, 
      lastSyncTime: time !== undefined ? time : state.lastSyncTime 
    })),
}));
