import { create } from 'zustand';

type AuthState = {
  isAuthModalOpen: boolean;
  returnUrl: string | null;
  openAuthModal: (returnUrl?: string) => void;
  closeAuthModal: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  isAuthModalOpen: false,
  returnUrl: null,
  openAuthModal: (returnUrl) =>
    set({ isAuthModalOpen: true, returnUrl: returnUrl || null }),
  closeAuthModal: () => set({ isAuthModalOpen: false, returnUrl: null }),
}));
