import {
    AppText,
    Button,
    Input,
    Notice,
    OtpInput,
    Screen,
    StepHeader,
} from "@/components/ui";
import { api, errorMessage, fieldErrors } from "@/lib/api";
import { useCountdown } from "@/lib/useCountDown";
import { spacing } from "@/theme";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";

interface Errors {
  code?: string;
  password?: string;
  form?: string;
}

export default function ResetPassword() {
  const router = useRouter();
  const { email = "" } = useLocalSearchParams<{ email?: string }>();

  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [info, setInfo] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  // A code was just sent when this screen opened
  const { seconds, restart } = useCountdown(60);

  async function submit() {
    const next: Errors = {};
    if (code.length !== 6) next.code = "Enter the 6 digit code";
    if (
      password.length < 8 ||
      !/[A-Za-z]/.test(password) ||
      !/\d/.test(password)
    ) {
      next.password = "Use at least 8 characters, with a letter and a number";
    }
    setErrors(next);
    setInfo("");
    if (next.code || next.password) return;

    setLoading(true);
    try {
      await api.post(
        "/auth/reset-password",
        { email, code, newPassword: password },
        { auth: false },
      );
      router.replace({ pathname: "/login", params: { email, reset: "1" } });
    } catch (err) {
      const fe = fieldErrors(err);
      setErrors({
        password: fe.newPassword,
        form: fe.newPassword ? undefined : errorMessage(err),
      });
      if (!fe.newPassword) setCode("");
    } finally {
      setLoading(false);
    }
  }

  async function resend() {
    if (seconds > 0 || resending) return;
    setResending(true);
    setErrors({});
    setInfo("");
    try {
      await api.post("/auth/forgot-password", { email }, { auth: false });
      setInfo("We sent a new code.");
      restart(60);
    } catch (err) {
      setErrors({ form: errorMessage(err) });
    } finally {
      setResending(false);
    }
  }

  return (
    <Screen scroll avoidKeyboard contentContainerStyle={styles.content}>
      <StepHeader total={2} current={1} onSelect={() => router.back()} />

      <AppText variant="h1" style={styles.title}>
        Choose a new password
      </AppText>
      <AppText variant="body" color="textMuted" style={styles.sub}>
        Enter the code we sent to{" "}
        <AppText variant="bodyMedium" color="text">
          {email}
        </AppText>
        , then set your new password.
      </AppText>

      {errors.form ? (
        <View style={styles.notice}>
          <Notice message={errors.form} />
        </View>
      ) : null}
      {info && !errors.form ? (
        <View style={styles.notice}>
          <Notice tone="info" message={info} />
        </View>
      ) : null}

      <OtpInput
        value={code}
        onChange={(v) => {
          setCode(v);
          if (errors.code || errors.form)
            setErrors((e) => ({ ...e, code: undefined, form: undefined }));
        }}
        hasError={!!errors.code || !!errors.form}
        autoFocus
      />
      {errors.code ? (
        <AppText variant="caption" color="danger" style={styles.codeError}>
          {errors.code}
        </AppText>
      ) : null}

      <Input
        label="New password"
        icon="lock-closed-outline"
        placeholder="New password"
        value={password}
        onChangeText={setPassword}
        error={errors.password}
        hint="At least 8 characters, with a letter and a number"
        secureTextEntry
        autoComplete="new-password"
        returnKeyType="go"
        onSubmitEditing={submit}
        containerStyle={styles.field}
      />

      <Button
        title="Reset password"
        loading={loading}
        onPress={submit}
        style={styles.submit}
      />

      <View style={styles.resend}>
        {seconds > 0 ? (
          <AppText variant="caption" color="textMuted">
            Resend code in {seconds}s
          </AppText>
        ) : (
          <Pressable onPress={resend} disabled={resending} hitSlop={10}>
            <AppText variant="bodyMedium" color="ink">
              {resending ? "Sending..." : "Resend code"}
            </AppText>
          </Pressable>
        )}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { paddingTop: spacing.md, paddingBottom: spacing.xl },
  title: { marginTop: spacing.xxl },
  sub: { marginTop: spacing.xs, marginBottom: spacing.xl },
  notice: { marginBottom: spacing.lg },
  codeError: { marginTop: spacing.sm },
  field: { marginTop: spacing.xl },
  submit: { marginTop: spacing.xl },
  resend: { alignItems: "center", marginTop: spacing.xl },
});
