import { PixelRatio } from "react-native";

// A square, resized and compressed version of a Cloudinary image, for thumbnails
export function cloudinaryThumb(uri: string, size: number): string {
  if (!uri.includes("res.cloudinary.com") || !uri.includes("/upload/"))
    return uri;
  const px = Math.round(size * PixelRatio.get());
  return uri.replace(
    "/upload/",
    `/upload/c_fill,w_${px},h_${px},f_auto,q_auto/`,
  );
}
