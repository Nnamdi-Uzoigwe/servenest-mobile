import {
    AppText,
    Button,
    Input,
    Notice,
    Screen,
    StepHeader,
} from "@/components/ui";
import { api, errorMessage } from "@/lib/api";
import { spacing } from "@/theme";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { StyleSheet, View } from "react-native";

export default function ForgotPassword() {
  const router = useRouter();
  const params = useLocalSearchParams<{ email?: string }>();

  const [email, setEmail] = useState(params.email ?? "");
  const [fieldError, setFieldError] = useState("");
  const [formError, setFormError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit() {
    const value = email.trim().toLowerCase();
    if (!/^\S+@\S+\.\S+$/.test(value)) {
      setFieldError("Enter a valid email address");
      return;
    }

    setFieldError("");
    setFormError("");
    setLoading(true);
    try {
      await api.post(
        "/auth/forgot-password",
        { email: value },
        { auth: false },
      );
      router.push({ pathname: "/reset-password", params: { email: value } });
    } catch (err) {
      setFormError(errorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <Screen scroll avoidKeyboard contentContainerStyle={styles.content}>
      <StepHeader total={2} current={0} />

      <AppText variant="h1" style={styles.title}>
        Reset your password
      </AppText>
      <AppText variant="body" color="textMuted" style={styles.sub}>
        Enter the email you signed up with and we will send you a 6 digit code.
      </AppText>

      {formError ? (
        <View style={styles.notice}>
          <Notice message={formError} />
        </View>
      ) : null}

      <Input
        label="Email"
        icon="mail-outline"
        placeholder="you@example.com"
        value={email}
        onChangeText={setEmail}
        error={fieldError}
        autoCapitalize="none"
        autoComplete="email"
        keyboardType="email-address"
        returnKeyType="send"
        onSubmitEditing={submit}
      />

      <Button
        title="Send code"
        loading={loading}
        onPress={submit}
        style={styles.submit}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { paddingTop: spacing.md, paddingBottom: spacing.xl },
  title: { marginTop: spacing.xxl },
  sub: { marginTop: spacing.xs, marginBottom: spacing.xxl },
  notice: { marginBottom: spacing.lg },
  submit: { marginTop: spacing.xl },
});
