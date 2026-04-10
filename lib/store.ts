import { create } from "zustand";

interface AppState {
  slideOverOpen: boolean;
  activeOrderId: string | null;
  selectedRows: Set<string>;
  syncStatus: "idle" | "syncing" | "synced";
  lastSyncTime: Date | null;
  openSlideOver: (orderId: string) => void;
  closeSlideOver: () => void;
  toggleRowSelection: (id: string) => void;
  clearSelection: () => void;
  setSyncStatus: (status: "idle" | "syncing" | "synced") => void;
  setLastSyncTime: (time: Date) => void;
}

export const useAppStore = create<AppState>((set) => ({
  slideOverOpen: false,
  activeOrderId: null,
  selectedRows: new Set(),
  syncStatus: "idle",
  lastSyncTime: null,
  openSlideOver: (orderId) => set({ slideOverOpen: true, activeOrderId: orderId }),
  closeSlideOver: () => set({ slideOverOpen: false, activeOrderId: null }),
  toggleRowSelection: (id) =>
    set((state) => {
      const next = new Set(state.selectedRows);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return { selectedRows: next };
    }),
  clearSelection: () => set({ selectedRows: new Set() }),
  setSyncStatus: (status) => set({ syncStatus: status }),
  setLastSyncTime: (time) => set({ lastSyncTime: time }),
}));
