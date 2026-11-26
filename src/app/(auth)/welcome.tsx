import { AppText, Screen } from "@/components/ui";
import { useStatusBar } from "@/lib/useStatusBar";
import { useOnboardingStore } from "@/store/onboardingStore";
import { colors, radius, spacing } from "@/theme";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Pressable, StyleSheet, View } from "react-native";

interface RoleSlabProps {
  title: string;
  description: string;
  tone: "champagne" | "ink";
  onPress: () => void;
}

function RoleSlab({ title, description, tone, onPress }: RoleSlabProps) {
  const onChampagne = tone === "champagne";

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={title}
      style={({ pressed }) => [
        styles.slab,
        onChampagne ? styles.slabChampagne : styles.slabInk,
        pressed && styles.slabPressed,
      ]}
    >
      <View style={styles.slabText}>
        <AppText variant="h2" color={onChampagne ? "ink" : "onInk"}>
          {title}
        </AppText>
        <AppText
          variant="caption"
          color={onChampagne ? "textMuted" : "onInkMuted"}
          style={styles.slabDescription}
        >
          {description}
        </AppText>
      </View>
      <View
        style={[
          styles.chevron,
          onChampagne ? styles.chevronInk : styles.chevronChampagne,
        ]}
      >
        <Ionicons
          name="chevron-forward"
          size={20}
          color={onChampagne ? colors.onInk : colors.ink}
        />
      </View>
    </Pressable>
  );
}

export default function Welcome() {
  const router = useRouter();
  const setIntent = useOnboardingStore((s) => s.setIntent);

  useStatusBar("light");

  return (
    <Screen ground="ink" scroll>
      <View style={styles.top}>
        <AppText variant="h2" color="onInk">
          ServeNest
        </AppText>
      </View>

      <View style={styles.hero}>
        <AppText variant="display" color="onInk">
          Home services, done properly.
        </AppText>
        <AppText variant="body" color="onInkMuted" style={styles.sub}>
          Choose how you will use ServeNest.
        </AppText>
      </View>

      <View style={styles.slabs}>
        <RoleSlab
          tone="champagne"
          title="I need a service"
          description="Book approved technicians and follow every job."
          onPress={() => {
            setIntent("customer");
            router.push("/customer/intro");
          }}
        />
        <RoleSlab
          tone="ink"
          title="I'm a technician"
          description="Get approved, take jobs and track your earnings."
          onPress={() => {
            setIntent("technician");
            router.push("/technician/intro");
          }}
        />
      </View>

      <View style={styles.footer}>
        <AppText variant="body" color="onInkMuted">
          Already have an account?
        </AppText>
        <Pressable onPress={() => router.push("/login")} hitSlop={10}>
          <AppText variant="bodyMedium" color="onInk">
            Sign in
          </AppText>
        </Pressable>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  top: { paddingTop: spacing.md },
  hero: { flex: 1, justifyContent: "center", paddingVertical: spacing.xxl },
  sub: { marginTop: spacing.md },
  slabs: { gap: spacing.md },
  slab: {
    flexDirection: "row",
    alignItems: "center",
    minHeight: 104,
    borderRadius: radius.xl,
    padding: 22,
  },
  slabChampagne: { backgroundColor: colors.champagne },
  slabInk: {
    backgroundColor: colors.inkLift,
    borderWidth: 1.5,
    borderColor: colors.inkLine,
  },
  slabPressed: { transform: [{ scale: 0.985 }] },
  slabText: { flex: 1, paddingRight: spacing.md },
  slabDescription: { marginTop: spacing.xs },
  chevron: {
    width: 40,
    height: 40,
    borderRadius: radius.pill,
    alignItems: "center",
    justifyContent: "center",
  },
  chevronInk: { backgroundColor: colors.ink },
  chevronChampagne: { backgroundColor: colors.champagne },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: spacing.sm,
    paddingVertical: spacing.xl,
  },
});
