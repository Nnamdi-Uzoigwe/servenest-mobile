import { AppText, Button, Panel } from "@/components/ui";
import { useAuthStore } from "@/store/authStore";
import { colors, radius, spacing } from "@/theme";
import { StyleSheet, View } from "react-native";

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

  if (!user) return null;

  const initials = user.fullName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]!.toUpperCase())
    .join("");

  return (
    <>
      <Panel tone="champagne" style={styles.panel}>
        <View style={styles.identity}>
          <View style={styles.avatar}>
            <AppText variant="h2" color="onInk">
              {initials}
            </AppText>
          </View>
          <View style={styles.meta}>
            <AppText variant="h3">{user.fullName}</AppText>
            <AppText variant="caption" color="textMuted">
              {user.email}
            </AppText>
          </View>
        </View>

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
  avatar: {
    width: 56,
    height: 56,
    borderRadius: radius.pill,
    backgroundColor: colors.ink,
    alignItems: "center",
    justifyContent: "center",
    marginRight: spacing.lg,
  },
  meta: { flex: 1 },
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
