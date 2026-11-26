import { ApplicationChecklist } from "@/components/technician/ApplicationChecklist";
import { AppText, Button, Notice, Panel, Screen } from "@/components/ui";
import { api, errorMessage } from "@/lib/api";
import {
  technicianProfileKey,
  useTechnicianProfile,
} from "@/lib/useTechnicianProfile";
import { useAuthStore } from "@/store/authStore";
import { colors, radius, spacing } from "@/theme";
import type { TechnicianApprovalStatus } from "@/types/api";
import { Ionicons } from "@expo/vector-icons";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "expo-router";
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
      "Read the reason below, fix what is needed, then resubmit. Contact support if you think this is a mistake.",
  },
  suspended: {
    icon: "ban-outline",
    title: "Your account is suspended",
    message: "You cannot take jobs while your account is suspended.",
  },
};

export default function ApprovalStatus() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const profile = useAuthStore((s) => s.technicianProfile);
  const refreshMe = useAuthStore((s) => s.refreshMe);
  const signOut = useAuthStore((s) => s.signOut);
  const { data: full } = useTechnicianProfile();

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
  const hasId = !!full?.documents.some((d) => d.type === "id_card");

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

  async function resubmit() {
    if (!hasId) {
      setError("Add your government ID before you resubmit.");
      return;
    }

    setLoading(true);
    setError("");
    try {
      await api.post("/technicians/me/resubmit", {});
      await refreshMe();
      await queryClient.invalidateQueries({ queryKey: technicianProfileKey });
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

      {status !== "suspended" ? (
        <View style={styles.checklist}>
          <ApplicationChecklist />
        </View>
      ) : null}

      {error ? (
        <View style={styles.notice}>
          <Notice message={error} />
        </View>
      ) : null}

      <View style={styles.actions}>
        {status === "rejected" ? (
          <Button
            title="Resubmit application"
            loading={loading}
            onPress={resubmit}
          />
        ) : (
          <Button title="Check status" loading={loading} onPress={check} />
        )}

        {status !== "suspended" ? (
          <Button
            title="Edit details"
            variant="tonal"
            onPress={() => router.push("/edit-application")}
          />
        ) : null}

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
  checklist: { marginTop: spacing.xxl },
  notice: { marginTop: spacing.lg },
  actions: { marginTop: spacing.xxl, gap: spacing.sm },
});
