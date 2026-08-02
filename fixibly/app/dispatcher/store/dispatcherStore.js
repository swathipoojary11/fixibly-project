"use client";
import { create } from "zustand";

/**
 * This store manages UI state for the dispatcher pages,
 * like search queries and filter values.
 */
const useDispatcherStore = create((set) => ({
  searchQuery: "",
  filters: {},
  setSearchQuery: (query) => set({ searchQuery: query }),
  setFilter: (key, value) =>
    set((state) => ({
      filters: { ...state.filters, [key]: value },
    })),
  clearSearch: () => set({ searchQuery: "" }),
  clearFilters: () => set({ filters: {} }),
}));

export default useDispatcherStore;
