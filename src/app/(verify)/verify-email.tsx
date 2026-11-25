import {
  AppText,
  Button,
  Notice,
  OtpInput,
  Screen,
  StepProgress,
} from "@/components/ui";
import { ApiError, errorMessage } from "@/lib/api";
import { useCountdown } from "@/lib/useCountDown";
import { useAuthStore } from "@/store/authStore";
import { colors, radius, spacing } from "@/theme";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";

const CODE_LENGTH = 6;

export default function VerifyEmail() {
  const user = useAuthStore((s) => s.user);
  const verifyEmail = useAuthStore((s) => s.verifyEmail);
  const resendVerification = useAuthStore((s) => s.resendVerification);
  const signOut = useAuthStore((s) => s.signOut);

  const email = user?.email ?? "";

  // A code goes out when the account is created, so the resend cooldown is already running
  const sinceCreated = user
    ? (Date.now() - new Date(user.createdAt).getTime()) / 1000
    : 60;
  const { seconds, restart } = useCountdown(
    Math.max(0, Math.ceil(60 - sinceCreated)),
  );

  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [resending, setResending] = useState(false);

  async function submit(value: string) {
    if (verifying || value.length !== CODE_LENGTH) return;
    setVerifying(true);
    setError("");
    setInfo("");
    try {
      // Once verified, the route guards move the person to the next screen
      await verifyEmail(value);
    } catch (err) {
      setError(errorMessage(err));
      setCode("");
    } finally {
      setVerifying(false);
    }
  }

  async function resend() {
    if (seconds > 0 || resending) return;
    setResending(true);
    setError("");
    setInfo("");
    try {
      await resendVerification();
      setInfo(`A new code was sent to ${email}.`);
      restart(60);
    } catch (err) {
      if (err instanceof ApiError && err.status === 429) restart(60);
      setError(errorMessage(err));
    } finally {
      setResending(false);
    }
  }

  return (
    <Screen scroll avoidKeyboard contentContainerStyle={styles.content}>
      {/* Customers see their 3 step setup. The technician version comes in 7d. */}
      {user?.role === "customer" ? (
        <StepProgress total={3} current={1} />
      ) : null}

      <View style={styles.tile}>
        <Ionicons name="mail-outline" size={30} color={colors.ink} />
      </View>

      <AppText variant="h1" style={styles.title}>
        Check your email
      </AppText>
      <AppText variant="body" color="textMuted">
        We sent a 6 digit code to{" "}
        <AppText variant="bodyMedium" color="text">
          {email}
        </AppText>
        . It expires in 10 minutes.
      </AppText>

      <View style={styles.otp}>
        <OtpInput
          value={code}
          onChange={(v) => {
            setCode(v);
            if (error) setError("");
          }}
          onComplete={submit}
          hasError={!!error}
          autoFocus
        />
      </View>

      {error ? <Notice message={error} /> : null}
      {info && !error ? <Notice tone="info" message={info} /> : null}

      <Button
        title="Verify email"
        loading={verifying}
        disabled={code.length !== CODE_LENGTH}
        onPress={() => submit(code)}
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

      <Button
        title="Use a different account"
        variant="ghost"
        onPress={() => signOut()}
        style={styles.switch}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { paddingTop: spacing.lg, paddingBottom: spacing.xl },
  tile: {
    width: 64,
    height: 64,
    borderRadius: radius.lg,
    backgroundColor: colors.champagne,
    alignItems: "center",
    justifyContent: "center",
    marginTop: spacing.xxl,
    marginBottom: spacing.xl,
  },
  title: { marginBottom: spacing.md },
  otp: { marginTop: spacing.xxl, marginBottom: spacing.lg },
  submit: { marginTop: spacing.lg },
  resend: { alignItems: "center", marginTop: spacing.xl },
  switch: { marginTop: spacing.xxl },
});
