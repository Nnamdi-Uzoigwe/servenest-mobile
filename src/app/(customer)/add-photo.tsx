import {
    AppText,
    Avatar,
    Button,
    Notice,
    Screen,
    StepProgress,
} from "@/components/ui";
import { useAvatarUpload } from "@/lib/useAvatarUpload";
import { useAuthStore } from "@/store/authStore";
import { useOnboardingStore } from "@/store/onboardingStore";
import { spacing } from "@/theme";
import { StyleSheet, View } from "react-native";

export default function AddPhoto() {
  const user = useAuthStore((s) => s.user);
  const markDone = useOnboardingStore((s) => s.markPhotoPromptDone);
  const { pick, uploading, error } = useAvatarUpload();

  if (!user) return null;

  // After a successful upload the user has an avatar, and the route guards move on to Home
  return (
    <Screen scroll contentContainerStyle={styles.content}>
      <StepProgress total={3} current={2} />

      <View style={styles.preview}>
        <Avatar name={user.fullName} uri={user.avatar?.url} size={168} />
      </View>

      <AppText variant="h1" style={styles.title}>
        Add a profile photo
      </AppText>
      <AppText variant="body" color="textMuted">
        Technicians see your photo when they arrive. You can change it later in
        Profile.
      </AppText>

      {error ? (
        <View style={styles.notice}>
          <Notice message={error} />
        </View>
      ) : null}

      <View style={styles.actions}>
        <Button
          title="Choose a photo"
          loading={uploading}
          onPress={() => pick("library")}
        />
        <Button
          title="Take a photo"
          variant="tonal"
          disabled={uploading}
          onPress={() => pick("camera")}
        />
        <Button
          title="Skip for now"
          variant="ghost"
          disabled={uploading}
          onPress={() => markDone(user.id)}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { paddingTop: spacing.lg, paddingBottom: spacing.xl },
  preview: {
    alignItems: "flex-start",
    marginTop: spacing.xxl,
    marginBottom: spacing.xl,
  },
  title: { marginBottom: spacing.md },
  notice: { marginTop: spacing.lg },
  actions: { marginTop: spacing.xxl, gap: spacing.sm },
});
