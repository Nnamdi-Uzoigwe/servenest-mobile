import { ApiError, api } from "@/lib/api";

export type UploadPurpose = "avatar" | "technician_document";

interface SignResponse {
  uploadUrl: string;
  apiKey: string;
  timestamp: number;
  signature: string;
  publicId: string;
  allowedFormats: string;
}

export interface UploadedImage {
  url: string;
  publicId: string;
}

const TIMEOUT_MS = 60_000;

// 1. ask our API for a signature, 2. upload straight to Cloudinary, 3. the caller registers the result
export async function uploadImage(
  purpose: UploadPurpose,
  localUri: string,
  mimeType?: string,
  fileName?: string,
): Promise<UploadedImage> {
  const sig = await api.post<SignResponse>("/uploads/sign", { purpose });

  const form = new FormData();
  form.append("file", {
    uri: localUri,
    name: fileName ?? "upload.jpg",
    type: mimeType ?? "image/jpeg",
  } as unknown as Blob);
  form.append("api_key", sig.apiKey);
  form.append("timestamp", String(sig.timestamp));
  form.append("signature", sig.signature);
  form.append("public_id", sig.publicId);
  form.append("allowed_formats", sig.allowedFormats);

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  let res: Response;
  try {
    // No Content-Type header here, fetch sets the multipart boundary itself
    res = await fetch(sig.uploadUrl, {
      method: "POST",
      body: form,
      signal: controller.signal,
    });
  } catch {
    throw new ApiError(
      0,
      "Upload failed. Check your connection and try again.",
    );
  } finally {
    clearTimeout(timer);
  }

  const json = (await res.json().catch(() => null)) as {
    secure_url?: string;
    public_id?: string;
    error?: { message?: string };
  } | null;

  if (!res.ok || !json?.secure_url || !json.public_id) {
    throw new ApiError(
      res.status || 0,
      json?.error?.message ?? "Upload failed. Please try again.",
    );
  }

  return { url: json.secure_url, publicId: json.public_id };
}
