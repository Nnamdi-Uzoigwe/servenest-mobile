import { api, errorMessage } from "@/lib/api";
import { uploadImage } from "@/lib/upload";
import { technicianProfileKey } from "@/lib/useTechnicianProfile";
import type { DocumentType } from "@/types/api";
import { useQueryClient } from "@tanstack/react-query";
import * as ImagePicker from "expo-image-picker";
import { useCallback, useState } from "react";

// Pick a photo of a document, upload it, register it on the application, or remove one.
// `busy` holds the document type being uploaded, or the id of the document being removed.
export function useDocumentUpload() {
  const queryClient = useQueryClient();
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState("");

  const refresh = useCallback(
    () => queryClient.invalidateQueries({ queryKey: technicianProfileKey }),
    [queryClient],
  );

  const add = useCallback(
    async (type: DocumentType, name: string, source: "library" | "camera") => {
      setError("");
      try {
        if (source === "camera") {
          const perm = await ImagePicker.requestCameraPermissionsAsync();
          if (!perm.granted) {
            setError(
              "Allow camera access in your phone settings to take a photo.",
            );
            return;
          }
        }

        // No cropping, so the whole document stays in the photo
        const options: ImagePicker.ImagePickerOptions = {
          mediaTypes: ["images"],
          allowsEditing: false,
          quality: 0.7,
        };
        const result =
          source === "camera"
            ? await ImagePicker.launchCameraAsync(options)
            : await ImagePicker.launchImageLibraryAsync(options);

        if (result.canceled) return;

        const asset = result.assets[0];
        setBusy(type);
        const uploaded = await uploadImage(
          "technician_document",
          asset.uri,
          asset.mimeType ?? undefined,
          asset.fileName ?? undefined,
        );
        await api.post("/technicians/me/documents", {
          type,
          name,
          ...uploaded,
        });
        await refresh();
      } catch (err) {
        setError(errorMessage(err));
      } finally {
        setBusy(null);
      }
    },
    [refresh],
  );

  const remove = useCallback(
    async (docId: string) => {
      setError("");
      setBusy(docId);
      try {
        await api.delete(`/technicians/me/documents/${docId}`);
        await refresh();
      } catch (err) {
        setError(errorMessage(err));
      } finally {
        setBusy(null);
      }
    },
    [refresh],
  );

  return { add, remove, busy, error };
}
