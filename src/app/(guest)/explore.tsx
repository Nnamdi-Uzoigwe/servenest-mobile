import { CatalogHome } from "@/components/catalog/CatalogHome";
import { AppText, BackButton, Button, Panel, Screen } from "@/components/ui";
import { useOnboardingStore } from "@/store/onboardingStore";
import { spacing } from "@/theme";
import { useRouter } from "expo-router";
import { StyleSheet, View } from "react-native";

export default function Explore() {
  const router = useRouter();
  const setIntent = useOnboardingStore((s) => s.setIntent);

  function signUp() {
    setIntent("customer");
    router.push("/customer/signup");
  }

  return (
    <Screen ground="white" scroll contentContainerStyle={styles.content}>
      <View style={styles.top}>
        <BackButton />
        <Button
          title="Sign in"
          variant="ghost"
          size="md"
          fullWidth={false}
          onPress={() => router.push("/login")}
        />
      </View>

      <AppText variant="h1" style={styles.title}>
        Find a technician
      </AppText>
      <AppText variant="body" color="textMuted" style={styles.sub}>
        Browse services and prices. You only need an account when you are ready
        to book.
      </AppText>

      <CatalogHome />

      <Panel tone="champagne" style={styles.cta}>
        <AppText variant="h2">Ready to book?</AppText>
        <AppText variant="body" color="textMuted" style={styles.ctaText}>
          Create a free account to request a service, get a quote and follow
          your job.
        </AppText>
        <Button title="Create an account" onPress={signUp} />
      </Panel>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { paddingTop: spacing.md, paddingBottom: spacing.xxxl },
  top: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: { marginTop: spacing.xl },
  sub: { marginTop: spacing.xs, marginBottom: spacing.xl },
  cta: { marginTop: spacing.xxl },
  ctaText: { marginTop: spacing.xs, marginBottom: spacing.lg },
});
