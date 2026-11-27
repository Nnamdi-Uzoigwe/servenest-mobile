import { CategoryIcon } from "@/components/catalog/CategoryIcon";
import { ErrorNotice } from "@/components/catalog/ErrorNotice";
import {
    AppText,
    BackButton,
    Button,
    Loader,
    Notice,
    Panel,
} from "@/components/ui";
import { ApiError } from "@/lib/api";
import { useCategoryLookup, useService } from "@/lib/catalog";
import { cloudinaryFit } from "@/lib/cloudinary";
import { formatDuration, formatNaira } from "@/lib/money";
import { useStatusBar } from "@/lib/useStatusBar";
import { useAuthStore } from "@/store/authStore";
import { useOnboardingStore } from "@/store/onboardingStore";
import { colors, spacing } from "@/theme";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
    Pressable,
    ScrollView,
    StyleSheet,
    View,
    useWindowDimensions,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const HERO_HEIGHT = 280;

export default function ServiceDetail() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const { slug } = useLocalSearchParams<{ slug: string }>();

  const signedIn = useAuthStore((s) => s.status === "signedIn");
  const setIntent = useOnboardingStore((s) => s.setIntent);

  const {
    data: service,
    isLoading,
    isError,
    error,
    refetch,
  } = useService(slug ?? "");
  const category = useCategoryLookup().get(service?.category._id ?? "");
  const heroImage = service?.image ?? category?.image;

  // Light status bar icons over a photo, dark ones over the plain champagne hero
  useStatusBar(heroImage ? "light" : "dark");

  const backButton = (
    <View style={[styles.back, { top: insets.top + spacing.sm }]}>
      <BackButton />
    </View>
  );

  if (isLoading) {
    return (
      <View style={styles.flex}>
        <Loader fullScreen />
        {backButton}
      </View>
    );
  }

  if (isError || !service) {
    const missing = error instanceof ApiError && error.status === 404;

    return (
      <View
        style={[styles.flex, styles.errorWrap, { paddingTop: insets.top + 72 }]}
      >
        {missing ? (
          <Notice message="That service is no longer available." />
        ) : (
          <ErrorNotice onRetry={() => void refetch()} />
        )}
        {backButton}
      </View>
    );
  }

  const canBook = service.isAvailable;

  function signUp() {
    setIntent("customer");
    router.push("/customer/signup");
  }

  return (
    <View style={styles.flex}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 140 }}
      >
        <View style={styles.hero}>
          {heroImage ? (
            <>
              <Image
                source={{ uri: cloudinaryFit(heroImage.url, width) }}
                style={StyleSheet.absoluteFill}
                contentFit="cover"
                transition={200}
                accessible={false}
              />
              {/* Keeps the status bar readable on bright photos */}
              <LinearGradient
                colors={["rgba(2, 44, 34, 0.5)", "rgba(2, 44, 34, 0)"]}
                style={styles.heroFade}
              />
            </>
          ) : (
            <View style={[StyleSheet.absoluteFill, styles.heroFallback]}>
              <CategoryIcon
                iconKey={service.category.iconKey}
                size={72}
                color={colors.ink}
              />
            </View>
          )}
        </View>

        <View style={styles.body}>
          <AppText variant="caption" color="textMuted">
            {service.category.name}
          </AppText>
          <AppText variant="h1" style={styles.title}>
            {service.name}
          </AppText>

          <Panel tone="champagne" style={styles.price}>
            <AppText variant="caption" color="textMuted">
              Starting from
            </AppText>
            <AppText variant="h1" color="ink">
              {formatNaira(service.startingPrice)}
            </AppText>
            {service.pricingNote ? (
              <AppText variant="caption" color="textMuted" style={styles.note}>
                {service.pricingNote}
              </AppText>
            ) : null}
          </Panel>

          <View style={styles.facts}>
            <View style={styles.fact}>
              <Ionicons name="time-outline" size={20} color={colors.ink} />
              <AppText variant="body">
                About {formatDuration(service.estimatedDurationMinutes)}
              </AppText>
            </View>
            <View style={styles.fact}>
              <Ionicons
                name={
                  service.isAvailable
                    ? "checkmark-circle-outline"
                    : "pause-circle-outline"
                }
                size={20}
                color={service.isAvailable ? colors.success : colors.warning}
              />
              <AppText variant="body">
                {service.isAvailable ? "Taking bookings" : "Paused for now"}
              </AppText>
            </View>
          </View>

          {!service.isAvailable ? (
            <View style={styles.paused}>
              <Notice
                tone="info"
                message="This service is not taking new bookings right now. Check back soon."
              />
            </View>
          ) : null}

          <AppText variant="h2" style={styles.aboutTitle}>
            About this service
          </AppText>
          <AppText variant="body" color="textMuted">
            {service.description || "Details for this service are coming soon."}
          </AppText>
        </View>
      </ScrollView>

      {backButton}

      <View style={[styles.bar, { paddingBottom: insets.bottom + spacing.md }]}>
        {!canBook ? (
          <Button title="Not available right now" disabled />
        ) : signedIn ? (
          <Button title="Booking opens soon" disabled />
        ) : (
          <>
            <Button title="Create an account to book" onPress={signUp} />
            <Pressable
              onPress={() => router.push("/login")}
              hitSlop={10}
              style={styles.signIn}
            >
              <AppText variant="bodyMedium" color="ink">
                I already have an account
              </AppText>
            </Pressable>
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.white },
  errorWrap: { paddingHorizontal: spacing.xl },
  back: { position: "absolute", left: spacing.xl },
  hero: { height: HERO_HEIGHT, backgroundColor: colors.champagne },
  heroFade: { position: "absolute", top: 0, left: 0, right: 0, height: 120 },
  heroFallback: { alignItems: "center", justifyContent: "center" },
  body: { padding: spacing.xl },
  title: { marginTop: spacing.xs },
  price: { marginTop: spacing.xl },
  note: { marginTop: spacing.xs },
  facts: { marginTop: spacing.xl, gap: spacing.md },
  fact: { flexDirection: "row", alignItems: "center", gap: spacing.md },
  paused: { marginTop: spacing.lg },
  aboutTitle: { marginTop: spacing.xxl, marginBottom: spacing.sm },
  bar: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    paddingTop: spacing.md,
    paddingHorizontal: spacing.xl,
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.line,
  },
  signIn: { alignSelf: "center", paddingVertical: spacing.md },
});
