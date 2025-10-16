import { create } from "zustand";

export type PaginationState = {
  page: number;
  limit: number;
  total: number;
  setPage: (page: number) => void;
  setLimit: (limit: number) => void;
  setTotal: (total: number) => void;
  reset: () => void;
};

export const usePaginationStore = create<PaginationState>((set) => ({
  page: 1,
  limit: 10,
  total: 0,
  setPage: (page) => set({ page }),
  setLimit: (limit) => set({ limit, page: 1 }),
  setTotal: (total) => set({ total }),
  reset: () => set({ page: 1, limit: 10, total: 0 }),
}));
