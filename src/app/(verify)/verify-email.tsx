import { AppText, Button, Notice, OtpInput, Screen } from "@/components/ui";
import { ApiError, errorMessage } from "@/lib/api";
import { useCountdown } from "@/lib/useCountDown";
import { useAuthStore } from "@/store/authStore";
import { colors, radius, spacing } from "@/theme";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";

const CODE_LENGTH = 6;

export default function VerifyEmail() {
  const email = useAuthStore((s) => s.user?.email ?? "");
  const verifyEmail = useAuthStore((s) => s.verifyEmail);
  const resendVerification = useAuthStore((s) => s.resendVerification);
  const signOut = useAuthStore((s) => s.signOut);

  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [resending, setResending] = useState(false);
  const { seconds, restart } = useCountdown(0);

  async function submit(value: string) {
    if (verifying || value.length !== CODE_LENGTH) return;
    setVerifying(true);
    setError("");
    setInfo("");
    try {
      // Once verified, the route guards move the person to their home screen
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
  otp: { marginTop: spacing.xxl, marginBottom: spacing.lg },
  submit: { marginTop: spacing.lg },
  resend: { alignItems: "center", marginTop: spacing.xl },
  switch: { marginTop: spacing.xxl },
});
