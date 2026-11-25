import {
    ApiError,
    api,
    clearTokens,
    loadTokens,
    saveTokens,
    setSessionExpiredHandler,
} from "@/lib/api";
import { queryClient } from "@/lib/queryClient";
import type {
    AuthResponse,
    MeResponse,
    RegisterCustomerInput,
    RegisterTechnicianInput,
    Role,
    TechnicianSummary,
    User,
} from "@/types/api";
import { create } from "zustand";

type Status = "loading" | "signedOut" | "signedIn";

// Staff accounts use the web dashboard
const MOBILE_ROLES: Role[] = ["customer", "technician"];

interface AuthState {
  status: Status;
  user: User | null;
  technicianProfile: TechnicianSummary | null;

  bootstrap: () => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  registerCustomer: (input: RegisterCustomerInput) => Promise<void>;
  registerTechnician: (input: RegisterTechnicianInput) => Promise<void>;
  refreshMe: () => Promise<void>;
  verifyEmail: (code: string) => Promise<void>;
  resendVerification: () => Promise<void>;
  signOut: () => Promise<void>;
  resetSession: () => void;
}

export const useAuthStore = create<AuthState>((set) => {
  async function acceptSession(res: AuthResponse) {
    if (!MOBILE_ROLES.includes(res.user.role)) {
      // Revoke the session that was just created
      api
        .post(
          "/auth/logout",
          { refreshToken: res.tokens.refreshToken },
          { auth: false },
        )
        .catch(() => {});
      throw new ApiError(
        403,
        "Admin and dispatcher accounts use the web dashboard.",
      );
    }

    await saveTokens(res.tokens);
    queryClient.clear();
    set({
      status: "signedIn",
      user: res.user,
      technicianProfile: res.technicianProfile,
    });
  }

  return {
    status: "loading",
    user: null,
    technicianProfile: null,

    bootstrap: async () => {
      try {
        const tokens = await loadTokens();
        if (!tokens) {
          set({ status: "signedOut" });
          return;
        }

        const me = await api.get<MeResponse>("/auth/me");
        if (!MOBILE_ROLES.includes(me.user.role)) {
          await clearTokens();
          set({ status: "signedOut", user: null, technicianProfile: null });
          return;
        }

        set({
          status: "signedIn",
          user: me.user,
          technicianProfile: me.technicianProfile,
        });
      } catch {
        // A rejected session was already cleared by the api client.
        // On a network failure the tokens are kept, so the next launch retries.
        set({ status: "signedOut", user: null, technicianProfile: null });
      }
    },

    signIn: async (email, password) => {
      const res = await api.post<AuthResponse>(
        "/auth/login",
        { email: email.trim().toLowerCase(), password },
        { auth: false },
      );
      await acceptSession(res);
    },

    registerCustomer: async (input) => {
      const res = await api.post<AuthResponse>(
        "/auth/register/customer",
        { ...input, email: input.email.trim().toLowerCase() },
        { auth: false },
      );
      await acceptSession(res);
    },

    registerTechnician: async (input) => {
      const res = await api.post<AuthResponse>(
        "/auth/register/technician",
        { ...input, email: input.email.trim().toLowerCase() },
        { auth: false },
      );
      await acceptSession(res);
    },

    refreshMe: async () => {
      const me = await api.get<MeResponse>("/auth/me");
      set({ user: me.user, technicianProfile: me.technicianProfile });
    },

    verifyEmail: async (code) => {
      await api.post("/auth/verify-email", { code });
      set((s) => ({
        user: s.user ? { ...s.user, isEmailVerified: true } : s.user,
      }));
    },

    resendVerification: async () => {
      await api.post("/auth/resend-verification");
    },

    signOut: async () => {
      const tokens = await loadTokens();
      if (tokens) {
        // Fire and forget, so signing out works offline too
        api
          .post(
            "/auth/logout",
            { refreshToken: tokens.refreshToken },
            { auth: false },
          )
          .catch(() => {});
      }
      await clearTokens();
      queryClient.clear();
      set({ status: "signedOut", user: null, technicianProfile: null });
    },

    resetSession: () => {
      queryClient.clear();
      set({ status: "signedOut", user: null, technicianProfile: null });
    },
  };
});

// When a refresh is definitively rejected, drop back to the signed out state
setSessionExpiredHandler(() => useAuthStore.getState().resetSession());
