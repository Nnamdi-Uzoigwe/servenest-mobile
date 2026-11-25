import { API_URL } from "@/lib/config";
import { tokenStorage } from "@/lib/secureStorage";
import type { AuthTokens } from "@/types/api";

const TIMEOUT_MS = 20_000;
const UNREACHABLE =
  "Cannot reach the server. Check your connection and try again.";

export type ApiErrorDetails = Record<string, string | string[]>;

export class ApiError extends Error {
  status: number;
  details?: ApiErrorDetails;

  constructor(status: number, message: string, details?: ApiErrorDetails) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.details = details;
    Object.setPrototypeOf(this, ApiError.prototype);
  }

  get isNetworkError() {
    return this.status === 0;
  }
}

export function errorMessage(
  err: unknown,
  fallback = "Something went wrong. Please try again.",
): string {
  return err instanceof Error && err.message ? err.message : fallback;
}

// Turns the backend's validation details into { fieldName: "first message" }
export function fieldErrors(err: unknown): Record<string, string> {
  const out: Record<string, string> = {};
  if (!(err instanceof ApiError) || !err.details) return out;
  for (const [key, value] of Object.entries(err.details)) {
    out[key] = Array.isArray(value) ? String(value[0] ?? "") : String(value);
  }
  return out;
}

// Tokens

let accessToken: string | null = null;
let sessionExpiredHandler: (() => void) | null = null;

export function setSessionExpiredHandler(fn: () => void) {
  sessionExpiredHandler = fn;
}

export async function loadTokens(): Promise<AuthTokens | null> {
  const tokens = await tokenStorage.load();
  accessToken = tokens?.accessToken ?? null;
  return tokens;
}

export async function saveTokens(tokens: AuthTokens): Promise<void> {
  accessToken = tokens.accessToken;
  await tokenStorage.save(tokens);
}

export async function clearTokens(): Promise<void> {
  accessToken = null;
  await tokenStorage.clear();
}

// Testing helper for step 6c, removed later
export function debugBreakAccessToken() {
  accessToken = "broken.token.value";
}

// Transport

interface Envelope {
  success?: boolean;
  message?: string;
  data?: unknown;
  details?: ApiErrorDetails;
}

async function send(
  method: string,
  path: string,
  body: unknown,
  token: string | null,
) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const res = await fetch(`${API_URL}${path}`, {
      method,
      headers: {
        Accept: "application/json",
        ...(body !== undefined ? { "Content-Type": "application/json" } : {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: body !== undefined ? JSON.stringify(body) : undefined,
      signal: controller.signal,
    });
    const json = (await res.json().catch(() => null)) as Envelope | null;
    return { res, json };
  } catch {
    throw new ApiError(0, UNREACHABLE);
  } finally {
    clearTimeout(timer);
  }
}

// Refresh: one request at a time, shared by every call that hits a 401

type RefreshResult =
  | { ok: true; token: string }
  | { ok: false; reason: "rejected" | "unavailable" };

let refreshInFlight: Promise<RefreshResult> | null = null;

function refreshAccessToken(): Promise<RefreshResult> {
  if (refreshInFlight) return refreshInFlight;

  refreshInFlight = (async (): Promise<RefreshResult> => {
    try {
      const stored = await tokenStorage.load();
      if (!stored) return { ok: false, reason: "rejected" };

      const { res, json } = await send(
        "POST",
        "/auth/refresh",
        { refreshToken: stored.refreshToken },
        null,
      );

      const tokens = (json?.data as { tokens?: AuthTokens } | undefined)
        ?.tokens;
      if (res.ok && tokens) {
        await saveTokens(tokens);
        return { ok: true, token: tokens.accessToken };
      }

      // Only a definite rejection ends the session
      if (res.status === 401 || res.status === 403) {
        await clearTokens();
        return { ok: false, reason: "rejected" };
      }
      return { ok: false, reason: "unavailable" };
    } catch {
      return { ok: false, reason: "unavailable" };
    } finally {
      refreshInFlight = null;
    }
  })();

  return refreshInFlight;
}

// Public client

interface Options {
  // Set false for public endpoints such as login and register
  auth?: boolean;
}

async function request<T>(
  method: string,
  path: string,
  body?: unknown,
  opts: Options = {},
): Promise<T> {
  const useAuth = opts.auth !== false;

  if (useAuth && !accessToken) await loadTokens();

  let { res, json } = await send(
    method,
    path,
    body,
    useAuth ? accessToken : null,
  );

  if (res.status === 401 && useAuth) {
    const result = await refreshAccessToken();

    if (result.ok) {
      ({ res, json } = await send(method, path, body, result.token));
    } else if (result.reason === "rejected") {
      sessionExpiredHandler?.();
      throw new ApiError(
        401,
        "Your session has expired. Please sign in again.",
      );
    } else {
      throw new ApiError(0, UNREACHABLE);
    }
  }

  if (!res.ok) {
    throw new ApiError(
      res.status,
      json?.message ?? "Something went wrong. Please try again.",
      json?.details,
    );
  }

  return json?.data as T;
}

export const api = {
  get: <T>(path: string, opts?: Options) =>
    request<T>("GET", path, undefined, opts),
  post: <T = void>(path: string, body?: unknown, opts?: Options) =>
    request<T>("POST", path, body, opts),
  put: <T = void>(path: string, body?: unknown, opts?: Options) =>
    request<T>("PUT", path, body, opts),
  patch: <T = void>(path: string, body?: unknown, opts?: Options) =>
    request<T>("PATCH", path, body, opts),
  delete: <T = void>(path: string, opts?: Options) =>
    request<T>("DELETE", path, undefined, opts),
};
