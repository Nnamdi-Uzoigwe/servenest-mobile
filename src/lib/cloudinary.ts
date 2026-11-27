import { PixelRatio } from "react-native";

const isCloudinary = (uri: string) =>
  uri.includes("res.cloudinary.com") && uri.includes("/upload/");

// A square, resized and compressed version of a Cloudinary image, for thumbnails
export function cloudinaryThumb(uri: string, size: number): string {
  if (!isCloudinary(uri)) return uri;
  const px = Math.round(size * PixelRatio.get());
  return uri.replace(
    "/upload/",
    `/upload/c_fill,g_auto,w_${px},h_${px},f_auto,q_auto/`,
  );
}

// Keeps the aspect ratio and caps the width, for large images
export function cloudinaryFit(uri: string, width: number): string {
  if (!isCloudinary(uri)) return uri;
  const px = Math.round(width * PixelRatio.get());
  return uri.replace("/upload/", `/upload/c_limit,w_${px},f_auto,q_auto/`);
}
