import { AppText } from "@/components/ui";
import { colors, spacing } from "@/theme";
import { ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface TabScaffoldProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}

// White screen with an emerald title. The green lives on the tab bar only.
export function TabScaffold({ title, subtitle, children }: TabScaffoldProps) {
  return (
    <SafeAreaView edges={["top"]} style={styles.root}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.body}
      >
        <View style={styles.header}>
          <AppText variant="h1" color="ink">
            {title}
          </AppText>
          {subtitle ? (
            <AppText variant="body" color="textMuted" style={styles.subtitle}>
              {subtitle}
            </AppText>
          ) : null}
        </View>

        {children}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.white },
  body: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xxxl,
  },
  header: { marginBottom: spacing.xl },
  subtitle: { marginTop: spacing.xs },
});
