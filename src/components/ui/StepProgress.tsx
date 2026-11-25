import { colors, radius } from "@/theme";
import { useEffect, useRef, useState } from "react";
import {
    AccessibilityInfo,
    Animated,
    Pressable,
    StyleSheet,
    View,
    type StyleProp,
    type ViewStyle,
} from "react-native";

interface StepProgressProps {
  total: number;
  // Zero based index of the current step
  current: number;
  tone?: "onPaper" | "onInk";
  // Lets the person tap a finished step to go back to it
  onSelect?: (index: number) => void;
  style?: StyleProp<ViewStyle>;
}

export function StepProgress({
  total,
  current,
  tone = "onPaper",
  onSelect,
  style,
}: StepProgressProps) {
  const values = useRef<Animated.Value[]>([]);
  if (values.current.length !== total) {
    values.current = Array.from(
      { length: total },
      (_, i) => new Animated.Value(i <= current ? 1 : 0),
    );
  }

  const [reduceMotion, setReduceMotion] = useState(false);
  useEffect(() => {
    AccessibilityInfo.isReduceMotionEnabled().then(setReduceMotion);
  }, []);

  // Finished and current segments are filled, the current one fills with a short animation
  useEffect(() => {
    Animated.parallel(
      values.current.map((value, i) =>
        Animated.timing(value, {
          toValue: i <= current ? 1 : 0,
          duration: reduceMotion ? 0 : 300,
          useNativeDriver: false,
        }),
      ),
    ).start();
  }, [current, total, reduceMotion]);

  const trackColor = tone === "onInk" ? colors.inkLine : colors.champagneDeep;
  const fillColor = tone === "onInk" ? colors.champagne : colors.ink;

  return (
    <View
      accessibilityRole="progressbar"
      accessibilityLabel={`Step ${current + 1} of ${total}`}
      accessibilityValue={{ min: 1, max: total, now: current + 1 }}
      style={[styles.row, style]}
    >
      {values.current.map((value, i) => {
        const canSelect = !!onSelect && i < current;
        const width = value.interpolate({
          inputRange: [0, 1],
          outputRange: ["0%", "100%"],
        });

        return (
          <Pressable
            key={i}
            disabled={!canSelect}
            onPress={() => onSelect?.(i)}
            hitSlop={{ top: 14, bottom: 14 }}
            accessibilityRole={canSelect ? "button" : undefined}
            accessibilityLabel={
              canSelect ? `Go back to step ${i + 1}` : undefined
            }
            style={styles.segment}
          >
            <View style={[styles.track, { backgroundColor: trackColor }]}>
              <Animated.View
                style={[styles.fill, { width, backgroundColor: fillColor }]}
              />
            </View>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", gap: 6 },
  segment: { flex: 1 },
  track: { height: 4, borderRadius: radius.pill, overflow: "hidden" },
  fill: { height: "100%", borderRadius: radius.pill },
});
