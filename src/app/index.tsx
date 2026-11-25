import {
  AppText,
  Button,
  Card,
  EmptyState,
  Input,
  Screen,
} from "@/components/ui";
import { spacing } from "@/theme";
import { useState } from "react";
import { StyleSheet, View } from "react-native";

export default function DesignPreview() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const emailError =
    email.length > 0 && !email.includes("@")
      ? "Enter a valid email address"
      : undefined;

  function fakeSubmit() {
    setLoading(true);
    setTimeout(() => setLoading(false), 1500);
  }

  return (
    <Screen scroll contentContainerStyle={styles.content}>
      <AppText variant="display" color="primary">
        ServeNest
      </AppText>
      <AppText variant="body" color="textMuted" style={styles.sub}>
        Design system preview
      </AppText>

      <Card style={styles.block}>
        <AppText variant="h3" style={styles.cardTitle}>
          Sign in
        </AppText>
        <Input
          label="Email"
          icon="mail-outline"
          placeholder="you@example.com"
          value={email}
          onChangeText={setEmail}
          error={emailError}
          autoCapitalize="none"
          keyboardType="email-address"
          containerStyle={styles.field}
        />
        <Input
          label="Password"
          icon="lock-closed-outline"
          placeholder="Your password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          hint="At least 8 characters"
          containerStyle={styles.field}
        />
        <Button title="Continue" loading={loading} onPress={fakeSubmit} />
      </Card>

      <View style={styles.block}>
        <Button
          title="Secondary button"
          variant="secondary"
          icon="construct-outline"
        />
        <View style={styles.gap} />
        <Button title="Outline button" variant="outline" />
        <View style={styles.gap} />
        <Button title="Ghost button" variant="ghost" />
        <View style={styles.gap} />
        <Button title="Disabled button" disabled />
      </View>

      <Card style={styles.block}>
        <EmptyState
          icon="calendar-outline"
          title="No bookings yet"
          message="When you book a service, it will show up here."
          actionLabel="Browse services"
          onAction={() => {}}
        />
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { paddingTop: spacing.xl, paddingBottom: spacing.xxxl },
  sub: { marginBottom: spacing.xl },
  block: { marginBottom: spacing.xl },
  cardTitle: { marginBottom: spacing.lg },
  field: { marginBottom: spacing.lg },
  gap: { height: spacing.md },
});
