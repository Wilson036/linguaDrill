// stores/modal.ts
import { create } from 'zustand';

type ModalPayload = {
  type?: string;
  id?: string;
  data?: unknown; // 想放什麼都行，物件/字串皆可
};

type ModalState = {
  open: boolean;
  payload: ModalPayload | null;
  openModal: (p: ModalPayload) => void;
  closeModal: () => void;
};

export const useModalStore = create<ModalState>((set) => ({
  open: false,
  payload: null,
  openModal: (p) => set({ open: true, payload: p }),
  closeModal: () => set({ open: false, payload: null }),
}));
