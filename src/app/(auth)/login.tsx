import {
  AppText,
  BackButton,
  Button,
  Input,
  Notice,
  Screen,
} from "@/components/ui";
import { errorMessage } from "@/lib/api";
import { useAuthStore } from "@/store/authStore";
import { useOnboardingStore } from "@/store/onboardingStore";
import { spacing } from "@/theme";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useRef, useState } from "react";
import { Pressable, StyleSheet, TextInput, View } from "react-native";

interface Errors {
  email?: string;
  password?: string;
  form?: string;
}

export default function Login() {
  const router = useRouter();
  const params = useLocalSearchParams<{ email?: string; reset?: string }>();
  const signIn = useAuthStore((s) => s.signIn);
  const intent = useOnboardingStore((s) => s.intent);

  const [email, setEmail] = useState(params.email ?? "");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [loading, setLoading] = useState(false);
  const passwordRef = useRef<TextInput>(null);

  async function submit() {
    const next: Errors = {};
    if (!/^\S+@\S+\.\S+$/.test(email.trim()))
      next.email = "Enter a valid email address";
    if (!password) next.password = "Enter your password";
    setErrors(next);
    if (next.email || next.password) return;

    setLoading(true);
    try {
      // On success the route guards move the person to the right screen
      await signIn(email, password);
    } catch (err) {
      setErrors({ form: errorMessage(err) });
      setLoading(false);
    }
  }

  function createAccount() {
    if (intent === "customer") router.replace("/customer/signup");
    else if (intent === "technician") router.replace("/technician/signup");
    else router.replace("/welcome");
  }

  return (
    <Screen scroll avoidKeyboard contentContainerStyle={styles.content}>
      <BackButton />

      <AppText variant="h1" style={styles.title}>
        Welcome back
      </AppText>
      <AppText variant="body" color="textMuted" style={styles.sub}>
        Sign in to your ServeNest account.
      </AppText>

      {params.reset === "1" && !errors.form ? (
        <View style={styles.notice}>
          <Notice
            tone="info"
            message="Password updated. Sign in with your new password."
          />
        </View>
      ) : null}
      {errors.form ? (
        <View style={styles.notice}>
          <Notice message={errors.form} />
        </View>
      ) : null}

      <Input
        label="Email"
        icon="mail-outline"
        placeholder="you@example.com"
        value={email}
        onChangeText={setEmail}
        error={errors.email}
        autoCapitalize="none"
        autoComplete="email"
        keyboardType="email-address"
        returnKeyType="next"
        onSubmitEditing={() => passwordRef.current?.focus()}
        containerStyle={styles.field}
      />
      <Input
        label="Password"
        icon="lock-closed-outline"
        placeholder="Your password"
        value={password}
        onChangeText={setPassword}
        error={errors.password}
        secureTextEntry
        autoComplete="password"
        returnKeyType="go"
        onSubmitEditing={submit}
        inputRef={passwordRef}
      />

      <Pressable
        onPress={() =>
          router.push({
            pathname: "/forgot-password",
            params: { email: email.trim() },
          })
        }
        hitSlop={10}
        style={styles.forgot}
      >
        <AppText variant="bodyMedium" color="ink">
          Forgot password?
        </AppText>
      </Pressable>

      <Button title="Sign in" loading={loading} onPress={submit} />

      <View style={styles.footer}>
        <AppText variant="body" color="textMuted">
          New to ServeNest?
        </AppText>
        <Pressable onPress={createAccount} hitSlop={10}>
          <AppText variant="bodyMedium" color="ink">
            Create an account
          </AppText>
        </Pressable>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { paddingTop: spacing.md, paddingBottom: spacing.xl },
  title: { marginTop: spacing.xxl },
  sub: { marginTop: spacing.xs, marginBottom: spacing.xxl },
  notice: { marginBottom: spacing.lg },
  field: { marginBottom: spacing.lg },
  forgot: {
    alignSelf: "flex-end",
    marginTop: spacing.md,
    marginBottom: spacing.xl,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: spacing.sm,
    marginTop: spacing.xxl,
  },
});
