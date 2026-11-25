import type { Role } from "@/types/api";
import { create } from "zustand";

export type SignupRole = Extract<Role, "customer" | "technician">;

// Remembers which flow the person chose on the welcome screen,
// so "Sign in" and "Create account" links return to the right role
interface OnboardingState {
  intent: SignupRole | null;
  setIntent: (role: SignupRole | null) => void;
}

export const useOnboardingStore = create<OnboardingState>((set) => ({
  intent: null,
  setIntent: (intent) => set({ intent }),
}));
