import { AppText, BackButton, Screen } from "@/components/ui";
import { spacing } from "@/theme";
import { StyleSheet } from "react-native";

export default function TechnicianSignup() {
  return (
    <Screen contentContainerStyle={styles.content}>
      <BackButton />
      <AppText variant="h1" style={styles.title}>
        Apply as a technician
      </AppText>
      <AppText variant="body" color="textMuted">
        The technician application flow is built in step 7.
      </AppText>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { paddingTop: spacing.md },
  title: { marginTop: spacing.xxl, marginBottom: spacing.sm },
});
