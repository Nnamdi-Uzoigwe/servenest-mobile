import {
  AppText,
  Button,
  Input,
  Notice,
  Screen,
  StepHeader,
} from "@/components/ui";
import { errorMessage, fieldErrors } from "@/lib/api";
import { useAuthStore } from "@/store/authStore";
import { spacing } from "@/theme";
import { useRouter } from "expo-router";
import { useRef, useState } from "react";
import { Pressable, StyleSheet, TextInput, View } from "react-native";

interface Errors {
  fullName?: string;
  email?: string;
  phone?: string;
  password?: string;
  form?: string;
}

export default function CustomerSignup() {
  const router = useRouter();
  const registerCustomer = useAuthStore((s) => s.registerCustomer);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [loading, setLoading] = useState(false);

  const emailRef = useRef<TextInput>(null);
  const phoneRef = useRef<TextInput>(null);
  const passwordRef = useRef<TextInput>(null);

  function validate(cleanPhone: string): Errors {
    const next: Errors = {};
    if (fullName.trim().length < 2) next.fullName = "Enter your full name";
    if (!/^\S+@\S+\.\S+$/.test(email.trim()))
      next.email = "Enter a valid email address";
    if (cleanPhone && !/^\+?\d{10,15}$/.test(cleanPhone))
      next.phone = "Enter a valid phone number";
    if (
      password.length < 8 ||
      !/[A-Za-z]/.test(password) ||
      !/\d/.test(password)
    ) {
      next.password = "Use at least 8 characters, with a letter and a number";
    }
    return next;
  }

  async function submit() {
    const cleanPhone = phone.replace(/[\s-]/g, "");
    const next = validate(cleanPhone);
    setErrors(next);
    if (Object.keys(next).length) return;

    setLoading(true);
    try {
      // On success the route guards move the person to email verification
      await registerCustomer({
        fullName: fullName.trim(),
        email,
        phone: cleanPhone || undefined,
        password,
      });
    } catch (err) {
      const fe = fieldErrors(err);
      const message = errorMessage(err);
      const server: Errors = {
        fullName: fe.fullName,
        email: fe.email,
        phone: fe.phone,
        password: fe.password,
      };
      if (!fe.fullName && !fe.email && !fe.phone && !fe.password) {
        if (/email/i.test(message)) server.email = message;
        else if (/phone/i.test(message)) server.phone = message;
        else server.form = message;
      }
      setErrors(server);
      setLoading(false);
    }
  }

  return (
    <Screen scroll avoidKeyboard contentContainerStyle={styles.content}>
      <StepHeader total={3} current={0} />

      <AppText variant="h1" style={styles.title}>
        Create your account
      </AppText>
      <AppText variant="body" color="textMuted" style={styles.sub}>
        It takes a minute. We will email you a code to confirm your address.
      </AppText>

      {errors.form ? (
        <View style={styles.notice}>
          <Notice message={errors.form} />
        </View>
      ) : null}

      <Input
        label="Full name"
        icon="person-outline"
        placeholder="Chidi Eze"
        value={fullName}
        onChangeText={setFullName}
        error={errors.fullName}
        autoCapitalize="words"
        autoComplete="name"
        returnKeyType="next"
        onSubmitEditing={() => emailRef.current?.focus()}
        containerStyle={styles.field}
      />
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
        inputRef={emailRef}
        onSubmitEditing={() => phoneRef.current?.focus()}
        containerStyle={styles.field}
      />
      <Input
        label="Phone number (optional)"
        icon="call-outline"
        placeholder="08012345678"
        value={phone}
        onChangeText={setPhone}
        error={errors.phone}
        autoComplete="tel"
        keyboardType="phone-pad"
        returnKeyType="next"
        inputRef={phoneRef}
        onSubmitEditing={() => passwordRef.current?.focus()}
        containerStyle={styles.field}
      />
      <Input
        label="Password"
        icon="lock-closed-outline"
        placeholder="Create a password"
        value={password}
        onChangeText={setPassword}
        error={errors.password}
        hint="At least 8 characters, with a letter and a number"
        secureTextEntry
        autoComplete="new-password"
        returnKeyType="go"
        inputRef={passwordRef}
        onSubmitEditing={submit}
      />

      <Button
        title="Create account"
        loading={loading}
        onPress={submit}
        style={styles.submit}
      />

      <View style={styles.footer}>
        <AppText variant="body" color="textMuted">
          Already have an account?
        </AppText>
        <Pressable onPress={() => router.push("/login")} hitSlop={10}>
          <AppText variant="bodyMedium" color="ink">
            Sign in
          </AppText>
        </Pressable>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { paddingTop: spacing.md, paddingBottom: spacing.xl },
  title: { marginTop: spacing.xxl },
  sub: { marginTop: spacing.xs, marginBottom: spacing.xl },
  notice: { marginBottom: spacing.lg },
  field: { marginBottom: spacing.lg },
  submit: { marginTop: spacing.xl },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: spacing.sm,
    marginTop: spacing.xxl,
  },
});
