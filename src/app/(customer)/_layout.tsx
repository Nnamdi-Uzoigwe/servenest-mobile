import { Loader } from "@/components/ui";
import { useAuthStore } from "@/store/authStore";
import { useOnboardingStore } from "@/store/onboardingStore";
import { Stack } from "expo-router";
import { useEffect } from "react";

export default function CustomerLayout() {
  const userId = useAuthStore((s) => s.user?.id);
  const hasAvatar = useAuthStore((s) => !!s.user?.avatar?.url);
  const done = useOnboardingStore((s) =>
    userId ? s.photoPromptDone[userId] : undefined,
  );
  const loadPhotoPrompt = useOnboardingStore((s) => s.loadPhotoPrompt);

  useEffect(() => {
    if (userId) loadPhotoPrompt(userId);
  }, [userId, loadPhotoPrompt]);

  // Still reading the saved "skipped" flag from the phone
  if (done === undefined) return <Loader fullScreen />;

  // Customers without a photo see the photo step once, until they add one or skip it
  const needsPhoto = !hasAvatar && !done;

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Protected guard={!needsPhoto}>
        <Stack.Screen name="(tabs)" />
      </Stack.Protected>

      <Stack.Protected guard={needsPhoto}>
        <Stack.Screen name="add-photo" />
      </Stack.Protected>
    </Stack>
  );
}
