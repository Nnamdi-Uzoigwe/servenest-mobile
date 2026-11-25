import { AppText, Button, Notice, Panel, Screen } from "@/components/ui";
import { errorMessage } from "@/lib/api";
import { useAuthStore } from "@/store/authStore";
import { colors, radius, spacing } from "@/theme";
import type { TechnicianApprovalStatus } from "@/types/api";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { StyleSheet, View } from "react-native";

type Blocked = Exclude<TechnicianApprovalStatus, "approved">;

const COPY: Record<
  Blocked,
  { icon: keyof typeof Ionicons.glyphMap; title: string; message: string }
> = {
  pending: {
    icon: "time-outline",
    title: "Your application is being reviewed",
    message:
      "We check your details and documents before technicians can take jobs. Tap Check status to see if you have been approved.",
  },
  rejected: {
    icon: "close-circle-outline",
    title: "Your application was not approved",
    message:
      "Read the reason below. Contact support if you think this is a mistake.",
  },
  suspended: {
    icon: "ban-outline",
    title: "Your account is suspended",
    message: "You cannot take jobs while your account is suspended.",
  },
};

export default function ApprovalStatus() {
  const profile = useAuthStore((s) => s.technicianProfile);
  const refreshMe = useAuthStore((s) => s.refreshMe);
  const signOut = useAuthStore((s) => s.signOut);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const status: Blocked =
    profile?.approvalStatus && profile.approvalStatus !== "approved"
      ? profile.approvalStatus
      : "pending";
  const copy = COPY[status];
  const reason =
    status === "rejected"
      ? profile?.rejectionReason
      : status === "suspended"
        ? profile?.suspensionReason
        : undefined;

  async function check() {
    setLoading(true);
    setError("");
    try {
      // If the account was approved, the route guards switch to the dashboard
      await refreshMe();
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <Screen scroll contentContainerStyle={styles.content}>
      <View style={styles.tile}>
        <Ionicons name={copy.icon} size={30} color={colors.ink} />
      </View>

      <AppText variant="h1" style={styles.title}>
        {copy.title}
      </AppText>
      <AppText variant="body" color="textMuted">
        {copy.message}
      </AppText>

      {reason ? (
        <Panel tone="champagne" style={styles.reason}>
          <AppText variant="caption" color="textMuted">
            Reason from the admin team
          </AppText>
          <AppText variant="body" style={styles.reasonText}>
            {reason}
          </AppText>
        </Panel>
      ) : null}

      {error ? (
        <View style={styles.notice}>
          <Notice message={error} />
        </View>
      ) : null}

      <View style={styles.actions}>
        <Button title="Check status" loading={loading} onPress={check} />
        <Button title="Sign out" variant="ghost" onPress={() => signOut()} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { paddingTop: spacing.xxxl, paddingBottom: spacing.xl },
  tile: {
    width: 64,
    height: 64,
    borderRadius: radius.lg,
    backgroundColor: colors.champagne,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.xl,
  },
  title: { marginBottom: spacing.md },
  reason: { marginTop: spacing.xl },
  reasonText: { marginTop: spacing.xs },
  notice: { marginTop: spacing.lg },
  actions: { marginTop: spacing.xxl, gap: spacing.sm },
});
