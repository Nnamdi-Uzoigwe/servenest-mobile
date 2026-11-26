import { TechnicianStepHeader } from "@/components/onboarding/TechnicianStepHeader";
import { AppText, Button, Input, Screen } from "@/components/ui";
import { useApplicationStore } from "@/store/technicianApplicationStore";
import { spacing } from "@/theme";
import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { Pressable, StyleSheet, TextInput, View } from "react-native";

interface Errors {
  fullName?: string;
  email?: string;
  phone?: string;
  password?: string;
}

export default function TechnicianAccountStep() {
  const router = useRouter();
  const { fullName, email, phone, password, accountError, update } =
    useApplicationStore();
  const [errors, setErrors] = useState<Errors>({});

  const emailRef = useRef<TextInput>(null);
  const phoneRef = useRef<TextInput>(null);
  const passwordRef = useRef<TextInput>(null);

  // The review step sends us back here if the email or phone is already registered
  useEffect(() => {
    if (accountError) {
      setErrors({ [accountError.field]: accountError.message });
      update({ accountError: null });
    }
  }, [accountError, update]);

  function next() {
    const cleanPhone = phone.replace(/[\s-]/g, "");
    const found: Errors = {};

    if (fullName.trim().length < 2) found.fullName = "Enter your full name";
    if (!/^\S+@\S+\.\S+$/.test(email.trim()))
      found.email = "Enter a valid email address";
    if (!/^\+?\d{10,15}$/.test(cleanPhone))
      found.phone = "Enter a valid phone number";
    if (
      password.length < 8 ||
      !/[A-Za-z]/.test(password) ||
      !/\d/.test(password)
    ) {
      found.password = "Use at least 8 characters, with a letter and a number";
    }

    setErrors(found);
    if (Object.keys(found).length) return;

    update({
      fullName: fullName.trim(),
      email: email.trim().toLowerCase(),
      phone: cleanPhone,
    });
    router.push("/technician/about");
  }

  return (
    <Screen scroll avoidKeyboard contentContainerStyle={styles.content}>
      <TechnicianStepHeader current={0} />

      <AppText variant="h1" style={styles.title}>
        Your account
      </AppText>
      <AppText variant="body" color="textMuted" style={styles.sub}>
        Customers and our team will use these details to reach you.
      </AppText>

      <Input
        label="Full name"
        icon="person-outline"
        placeholder="Musa Bello"
        value={fullName}
        onChangeText={(v) => {
          update({ fullName: v });
          if (errors.fullName)
            setErrors((e) => ({ ...e, fullName: undefined }));
        }}
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
        onChangeText={(v) => {
          update({ email: v });
          if (errors.email) setErrors((e) => ({ ...e, email: undefined }));
        }}
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
        label="Phone number"
        icon="call-outline"
        placeholder="08012345678"
        value={phone}
        onChangeText={(v) => {
          update({ phone: v });
          if (errors.phone) setErrors((e) => ({ ...e, phone: undefined }));
        }}
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
        onChangeText={(v) => {
          update({ password: v });
          if (errors.password)
            setErrors((e) => ({ ...e, password: undefined }));
        }}
        error={errors.password}
        hint="At least 8 characters, with a letter and a number"
        secureTextEntry
        autoComplete="new-password"
        returnKeyType="go"
        inputRef={passwordRef}
        onSubmitEditing={next}
      />

      <Button title="Continue" onPress={next} style={styles.submit} />

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
  field: { marginBottom: spacing.lg },
  submit: { marginTop: spacing.xl },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: spacing.sm,
    marginTop: spacing.xxl,
  },
});
