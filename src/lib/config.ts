const url = process.env.EXPO_PUBLIC_API_URL;

if (!url) {
  console.warn(
    "EXPO_PUBLIC_API_URL is not set. Falling back to localhost, which a phone cannot reach.",
  );
}

export const API_URL = (url ?? "http://localhost:5000/api/v1").replace(
  /\/+$/,
  "",
);
