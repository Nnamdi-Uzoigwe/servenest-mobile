import { AppText } from "@/components/ui";
import { colors, radius, spacing } from "@/theme";
import { ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface TabScaffoldProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}

// Emerald header with the title, then a paper sheet that holds the screen content
export function TabScaffold({ title, subtitle, children }: TabScaffoldProps) {
  return (
    <SafeAreaView edges={["top"]} style={styles.root}>
      <View style={styles.header}>
        <AppText variant="h1" color="onInk">
          {title}
        </AppText>
        {subtitle ? (
          <AppText variant="body" color="onInkMuted" style={styles.subtitle}>
            {subtitle}
          </AppText>
        ) : null}
      </View>

      <View style={styles.sheet}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.body}
        >
          {children}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.ink },
  header: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xl,
  },
  subtitle: { marginTop: spacing.xs },
  sheet: {
    flex: 1,
    backgroundColor: colors.paper,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
  },
  body: { padding: spacing.xl, paddingBottom: spacing.xxxl },
});
