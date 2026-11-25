import { AppText, Button, Card, Input, Screen } from "@/components/ui";
import { debugBreakAccessToken, errorMessage } from "@/lib/api";
import { useAuthStore } from "@/store/authStore";
import { spacing } from "@/theme";
import { useState } from "react";
import { StyleSheet, View } from "react-native";

export default function AuthCheck() {
  const { status, user, technicianProfile, signIn, signOut, refreshMe } =
    useAuthStore();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [log, setLog] = useState("");

  async function run(label: string, fn: () => Promise<unknown>) {
    setBusy(true);
    try {
      await fn();
      setLog(`${label}: OK`);
    } catch (err) {
      setLog(`${label}: ${errorMessage(err)}`);
    } finally {
      setBusy(false);
    }
  }

  return (
    <Screen scroll contentContainerStyle={styles.content}>
      <AppText variant="h1" color="primary" style={styles.title}>
        Auth check
      </AppText>

      {status === "signedOut" ? (
        <Card>
          <Input
            label="Email"
            icon="mail-outline"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            containerStyle={styles.field}
          />
          <Input
            label="Password"
            icon="lock-closed-outline"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            containerStyle={styles.field}
          />
          <Button
            title="Sign in"
            loading={busy}
            onPress={() => run("Sign in", () => signIn(email, password))}
          />
        </Card>
      ) : (
        <>
          <Card style={styles.block}>
            <AppText variant="bodyMedium">{user?.fullName}</AppText>
            <AppText variant="caption" color="textMuted">
              {user?.email}
            </AppText>
            <View style={styles.gap} />
            <AppText variant="body">Role: {user?.role}</AppText>
            <AppText variant="body">
              Email verified: {user?.isEmailVerified ? "yes" : "no"}
            </AppText>
            {user?.role === "technician" ? (
              <AppText variant="body">
                Approval: {technicianProfile?.approvalStatus ?? "unknown"}
              </AppText>
            ) : null}
          </Card>

          <Button
            title="Call /auth/me"
            variant="outline"
            loading={busy}
            onPress={() => run("/auth/me", refreshMe)}
            style={styles.gap}
          />
          <Button
            title="Break token, then call /auth/me"
            variant="secondary"
            loading={busy}
            onPress={() =>
              run("Refresh retry", async () => {
                debugBreakAccessToken();
                await refreshMe();
              })
            }
            style={styles.gap}
          />
          <Button
            title="Sign out"
            variant="ghost"
            onPress={() => run("Sign out", signOut)}
            style={styles.gap}
          />
        </>
      )}

      {log ? (
        <AppText variant="caption" color="textMuted" style={styles.log}>
          {log}
        </AppText>
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { paddingTop: spacing.xl, paddingBottom: spacing.xxxl },
  title: { marginBottom: spacing.xl },
  field: { marginBottom: spacing.lg },
  block: { marginBottom: spacing.lg },
  gap: { marginTop: spacing.md },
  log: { marginTop: spacing.xl },
});
