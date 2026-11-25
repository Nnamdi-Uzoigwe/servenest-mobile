import { api, errorMessage } from "@/lib/api";
import { uploadImage } from "@/lib/upload";
import { useAuthStore } from "@/store/authStore";
import * as ImagePicker from "expo-image-picker";
import { useCallback, useState } from "react";

// Pick (or take) a photo, upload it, save it as the avatar, then reload the user
export function useAvatarUpload() {
  const refreshMe = useAuthStore((s) => s.refreshMe);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const pick = useCallback(
    async (source: "library" | "camera"): Promise<boolean> => {
      setError("");
      try {
        if (source === "camera") {
          const perm = await ImagePicker.requestCameraPermissionsAsync();
          if (!perm.granted) {
            setError(
              "Allow camera access in your phone settings to take a photo.",
            );
            return false;
          }
        }

        const options: ImagePicker.ImagePickerOptions = {
          mediaTypes: ["images"],
          allowsEditing: true,
          aspect: [1, 1],
          quality: 0.6,
        };
        const result =
          source === "camera"
            ? await ImagePicker.launchCameraAsync(options)
            : await ImagePicker.launchImageLibraryAsync(options);

        if (result.canceled) return false;

        const asset = result.assets[0];
        setUploading(true);
        const uploaded = await uploadImage(
          "avatar",
          asset.uri,
          asset.mimeType ?? undefined,
          asset.fileName ?? undefined,
        );
        await api.patch("/users/me/avatar", uploaded);
        await refreshMe();
        return true;
      } catch (err) {
        setError(errorMessage(err));
        return false;
      } finally {
        setUploading(false);
      }
    },
    [refreshMe],
  );

  return { pick, uploading, error, clearError: () => setError("") };
}
