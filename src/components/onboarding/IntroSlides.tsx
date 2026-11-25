import { AppText, Button, StepProgress } from "@/components/ui";
import { colors, radius, spacing } from "@/theme";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useRef, useState } from "react";
import {
    Pressable,
    ScrollView,
    StyleSheet,
    View,
    useWindowDimensions,
    type NativeScrollEvent,
    type NativeSyntheticEvent,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export interface IntroSlide {
  image: number;
  title: string;
  description: string;
}

interface IntroSlidesProps {
  slides: readonly IntroSlide[];
  finishLabel: string;
  // Runs on the last slide's button and on Skip
  onDone: () => void;
}

const INK_CLEAR = "rgba(6, 78, 59, 0)";
const INK_SHADE = "rgba(2, 44, 34, 0.6)";

export function IntroSlides({ slides, finishLabel, onDone }: IntroSlidesProps) {
  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const scrollRef = useRef<ScrollView>(null);
  const [index, setIndex] = useState(0);

  const photoHeight = Math.round(height * 0.6);
  const isLast = index === slides.length - 1;

  function goTo(i: number) {
    scrollRef.current?.scrollTo({ x: i * width, animated: true });
    setIndex(i);
  }

  function onScrollEnd(e: NativeSyntheticEvent<NativeScrollEvent>) {
    setIndex(Math.round(e.nativeEvent.contentOffset.x / width));
  }

  return (
    <View style={styles.root}>
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={onScrollEnd}
      >
        {slides.map((slide, i) => (
          <View key={i} style={{ width, height }}>
            <Image
              source={slide.image}
              style={{ width, height: photoHeight }}
              contentFit="cover"
              accessible={false}
            />
            {/* Keeps the progress lines readable on bright photos */}
            <LinearGradient
              colors={[INK_SHADE, INK_CLEAR]}
              style={styles.topFade}
            />
            {/* Blends the photo into the ink ground */}
            <LinearGradient
              colors={[INK_CLEAR, colors.ink]}
              style={[
                styles.bottomFade,
                { top: photoHeight * 0.4, height: photoHeight * 0.6 },
              ]}
            />

            <View style={[styles.copy, { top: photoHeight - 64 }]}>
              <AppText variant="h1" color="onInk">
                {slide.title}
              </AppText>
              <AppText
                variant="body"
                color="onInkMuted"
                style={styles.description}
              >
                {slide.description}
              </AppText>
            </View>
          </View>
        ))}
      </ScrollView>

      <View
        style={[styles.topBar, { paddingTop: insets.top + spacing.md }]}
        pointerEvents="box-none"
      >
        <StepProgress
          total={slides.length}
          current={index}
          tone="onInk"
          onSelect={goTo}
        />
        {!isLast ? (
          <Pressable
            onPress={onDone}
            hitSlop={10}
            accessibilityRole="button"
            accessibilityLabel="Skip introduction"
            style={styles.skip}
          >
            <AppText variant="label" color="onInk">
              Skip
            </AppText>
          </Pressable>
        ) : null}
      </View>

      <View
        style={[
          styles.bottomBar,
          { paddingBottom: insets.bottom + spacing.xl },
        ]}
      >
        <Button
          title={isLast ? finishLabel : "Next"}
          variant="champagne"
          onPress={() => (isLast ? onDone() : goTo(index + 1))}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.ink },
  topFade: { position: "absolute", top: 0, left: 0, right: 0, height: 170 },
  bottomFade: { position: "absolute", left: 0, right: 0 },
  copy: {
    position: "absolute",
    left: 0,
    right: 0,
    paddingHorizontal: spacing.xl,
  },
  description: { marginTop: spacing.md },
  topBar: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    paddingHorizontal: spacing.xl,
  },
  skip: {
    alignSelf: "flex-end",
    marginTop: spacing.md,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.pill,
    backgroundColor: "rgba(2, 44, 34, 0.5)",
  },
  bottomBar: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: spacing.xl,
  },
});
