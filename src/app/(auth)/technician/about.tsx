import { TechnicianStepHeader } from "@/components/onboarding/TechnicianStepHeader";
import { AppText, Button, Input, Screen } from "@/components/ui";
import { useApplicationStore } from "@/store/technicianApplicationStore";
import { spacing } from "@/theme";
import { useRouter } from "expo-router";
import { useRef, useState } from "react";
import { StyleSheet, TextInput } from "react-native";

interface Errors {
  residentialAddress?: string;
  yearsOfExperience?: string;
  bio?: string;
}

export default function TechnicianAboutStep() {
  const router = useRouter();
  const { residentialAddress, yearsOfExperience, bio, update } =
    useApplicationStore();
  const [errors, setErrors] = useState<Errors>({});
  const yearsRef = useRef<TextInput>(null);
  const bioRef = useRef<TextInput>(null);

  function next() {
    const found: Errors = {};
    const address = residentialAddress.trim();
    const years = Number(yearsOfExperience);

    if (address.length < 5)
      found.residentialAddress = "Enter your full address";
    if (address.length > 300) found.residentialAddress = "Address is too long";
    if (
      yearsOfExperience === "" ||
      !Number.isInteger(years) ||
      years < 0 ||
      years > 60
    ) {
      found.yearsOfExperience = "Enter whole years, from 0 to 60";
    }
    if (bio.length > 1000) found.bio = "Keep your bio under 1000 characters";

    setErrors(found);
    if (Object.keys(found).length) return;

    update({ residentialAddress: address, bio: bio.trim() });
    router.push("/technician/skills");
  }

  return (
    <Screen scroll avoidKeyboard contentContainerStyle={styles.content}>
      <TechnicianStepHeader current={1} />

      <AppText variant="h1" style={styles.title}>
        About you
      </AppText>
      <AppText variant="body" color="textMuted" style={styles.sub}>
        This helps our team review your application and match you with the right
        jobs.
      </AppText>

      <Input
        label="Residential address"
        icon="home-outline"
        placeholder="12 Gwarinpa Estate, Abuja"
        value={residentialAddress}
        onChangeText={(v) => {
          update({ residentialAddress: v });
          if (errors.residentialAddress)
            setErrors((e) => ({ ...e, residentialAddress: undefined }));
        }}
        error={errors.residentialAddress}
        autoComplete="street-address"
        returnKeyType="next"
        onSubmitEditing={() => yearsRef.current?.focus()}
        containerStyle={styles.field}
      />
      <Input
        label="Years of experience"
        icon="time-outline"
        placeholder="5"
        value={yearsOfExperience}
        onChangeText={(v) => {
          update({ yearsOfExperience: v.replace(/\D/g, "").slice(0, 2) });
          if (errors.yearsOfExperience)
            setErrors((e) => ({ ...e, yearsOfExperience: undefined }));
        }}
        error={errors.yearsOfExperience}
        hint="Use 0 if you are just starting out"
        keyboardType="number-pad"
        inputRef={yearsRef}
        containerStyle={styles.field}
      />
      <Input
        label="Short bio (optional)"
        placeholder="Tell customers about your work and the jobs you do best."
        value={bio}
        onChangeText={(v) => {
          update({ bio: v });
          if (errors.bio) setErrors((e) => ({ ...e, bio: undefined }));
        }}
        error={errors.bio}
        hint={`${bio.length}/1000`}
        multiline
        maxLength={1000}
        inputRef={bioRef}
      />

      <Button title="Continue" onPress={next} style={styles.submit} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { paddingTop: spacing.md, paddingBottom: spacing.xl },
  title: { marginTop: spacing.xxl },
  sub: { marginTop: spacing.xs, marginBottom: spacing.xl },
  field: { marginBottom: spacing.lg },
  submit: { marginTop: spacing.xl },
});
