import { AppText, Avatar, Button, Notice, Panel } from "@/components/ui";
import { useAvatarUpload } from "@/lib/useAvatarUpload";
import { useAuthStore } from "@/store/authStore";
import { colors, radius, spacing } from "@/theme";
import { Ionicons } from "@expo/vector-icons";
import { ActivityIndicator, Alert, Pressable, StyleSheet, View } from "react-native";

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.infoRow}>
      <AppText variant="caption" color="textMuted">
        {label}
      </AppText>
      <AppText variant="bodyMedium">{value}</AppText>
    </View>
  );
}

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

export function AccountPanel() {
  const user = useAuthStore((s) => s.user);
  const approval = useAuthStore((s) => s.technicianProfile?.approvalStatus);
  const signOut = useAuthStore((s) => s.signOut);
  const { pick, uploading, error } = useAvatarUpload();

  if (!user) return null;

  function changePhoto() {
    Alert.alert("Profile photo", undefined, [
      { text: "Choose from gallery", onPress: () => void pick("library") },
      { text: "Take a photo", onPress: () => void pick("camera") },
      { text: "Cancel", style: "cancel" },
    ]);
  }

  return (
    <>
      <Panel tone="champagne" style={styles.panel}>
        <View style={styles.identity}>
          <Pressable
            onPress={changePhoto}
            disabled={uploading}
            accessibilityRole="button"
            accessibilityLabel="Change profile photo"
            style={styles.avatarWrap}
          >
            <Avatar name={user.fullName} uri={user.avatar?.url} size={64} />
            <View style={styles.badge}>
              {uploading ? (
                <ActivityIndicator size="small" color={colors.onInk} />
              ) : (
                <Ionicons name="camera" size={13} color={colors.onInk} />
              )}
            </View>
          </Pressable>

          <View style={styles.meta}>
            <AppText variant="h3">{user.fullName}</AppText>
            <AppText variant="caption" color="textMuted">
              {user.email}
            </AppText>
          </View>
        </View>

        {error ? (
          <View style={styles.notice}>
            <Notice message={error} />
          </View>
        ) : null}

        <View style={styles.rows}>
          <InfoRow
            label="Account type"
            value={user.role === "customer" ? "Customer" : "Technician"}
          />
          <InfoRow
            label="Email"
            value={user.isEmailVerified ? "Verified" : "Not verified"}
          />
          {approval ? (
            <InfoRow label="Approval" value={capitalize(approval)} />
          ) : null}
        </View>
      </Panel>

      <Button title="Sign out" variant="tonal" onPress={() => signOut()} />
    </>
  );
}

const styles = StyleSheet.create({
  panel: { marginBottom: spacing.lg },
  identity: { flexDirection: "row", alignItems: "center" },
  avatarWrap: { marginRight: spacing.lg },
  badge: {
    position: "absolute",
    right: -2,
    bottom: -2,
    width: 24,
    height: 24,
    borderRadius: radius.pill,
    backgroundColor: colors.inkLift,
    borderWidth: 2,
    borderColor: colors.champagne,
    alignItems: "center",
    justifyContent: "center",
  },
  meta: { flex: 1 },
  notice: { marginTop: spacing.lg },
  rows: { marginTop: spacing.lg },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.champagneDeep,
  },
});
