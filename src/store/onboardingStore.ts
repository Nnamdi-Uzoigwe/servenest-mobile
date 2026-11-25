import type { Role } from "@/types/api";
import * as SecureStore from "expo-secure-store";
import { create } from "zustand";

export type SignupRole = Extract<Role, "customer" | "technician">;

const photoKey = (userId: string) => `servenest.photoprompt.${userId}`;

interface OnboardingState {
  // Remembers which flow the person chose on the welcome screen,
  // so "Sign in" and "Create account" links return to the right role
  intent: SignupRole | null;
  setIntent: (role: SignupRole | null) => void;

  // Whether the one time "add a photo" step was finished or skipped, per account.
  // A missing key means it has not been loaded from the phone yet.
  photoPromptDone: Record<string, boolean>;
  loadPhotoPrompt: (userId: string) => Promise<void>;
  markPhotoPromptDone: (userId: string) => Promise<void>;
}

export const useOnboardingStore = create<OnboardingState>((set) => ({
  intent: null,
  setIntent: (intent) => set({ intent }),

  photoPromptDone: {},

  loadPhotoPrompt: async (userId) => {
    let done = false;
    try {
      done = (await SecureStore.getItemAsync(photoKey(userId))) === "1";
    } catch {}
    set((s) => ({ photoPromptDone: { ...s.photoPromptDone, [userId]: done } }));
  },

  markPhotoPromptDone: async (userId) => {
    set((s) => ({ photoPromptDone: { ...s.photoPromptDone, [userId]: true } }));
    try {
      await SecureStore.setItemAsync(photoKey(userId), "1");
    } catch {}
  },
}));
