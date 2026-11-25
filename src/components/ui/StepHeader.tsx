import { BackButton } from "@/components/ui/BackButton";
import { StepProgress } from "@/components/ui/StepProgress";
import { spacing } from "@/theme";
import { StyleSheet, View } from "react-native";

interface StepHeaderProps {
  total: number;
  current: number;
  onSelect?: (index: number) => void;
}

// Back button on the left, progress lines filling the rest of the row
export function StepHeader({ total, current, onSelect }: StepHeaderProps) {
  return (
    <View style={styles.row}>
      <BackButton />
      <StepProgress
        total={total}
        current={current}
        onSelect={onSelect}
        style={styles.progress}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center", gap: spacing.lg },
  progress: { flex: 1 },
});
