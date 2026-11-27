import { Button, Notice } from "@/components/ui";
import { spacing } from "@/theme";
import { StyleSheet, View } from "react-native";

interface ErrorNoticeProps {
  message?: string;
  onRetry: () => void;
}

export function ErrorNotice({
  message = "We could not load services. Check your connection and try again.",
  onRetry,
}: ErrorNoticeProps) {
  return (
    <View style={styles.wrap}>
      <Notice message={message} />
      <Button
        title="Try again"
        variant="tonal"
        size="md"
        fullWidth={false}
        onPress={onRetry}
        style={styles.button}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginVertical: spacing.lg },
  button: { marginTop: spacing.md },
});
