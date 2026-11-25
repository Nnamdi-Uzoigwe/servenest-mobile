import type { AuthTokens } from "@/types/api";
import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

const KEY = "servenest.tokens";

// SecureStore does not exist on web, so web falls back to localStorage (dev only)
async function read(): Promise<string | null> {
  if (Platform.OS === "web") {
    try {
      return globalThis.localStorage?.getItem(KEY) ?? null;
    } catch {
      return null;
    }
  }
  return SecureStore.getItemAsync(KEY);
}

async function write(value: string): Promise<void> {
  if (Platform.OS === "web") {
    try {
      globalThis.localStorage?.setItem(KEY, value);
    } catch {}
    return;
  }
  await SecureStore.setItemAsync(KEY, value);
}

async function remove(): Promise<void> {
  if (Platform.OS === "web") {
    try {
      globalThis.localStorage?.removeItem(KEY);
    } catch {}
    return;
  }
  await SecureStore.deleteItemAsync(KEY);
}

export const tokenStorage = {
  async load(): Promise<AuthTokens | null> {
    try {
      const raw = await read();
      if (!raw) return null;
      const parsed = JSON.parse(raw) as Partial<AuthTokens>;
      if (!parsed.accessToken || !parsed.refreshToken) return null;
      return {
        accessToken: parsed.accessToken,
        refreshToken: parsed.refreshToken,
      };
    } catch {
      return null;
    }
  },
  save: (tokens: AuthTokens) => write(JSON.stringify(tokens)),
  clear: remove,
};
