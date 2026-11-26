import { AppText } from "@/components/ui/AppText";
import { Input } from "@/components/ui/Input";
import { colors, layout, radius, spacing } from "@/theme";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useMemo, useState } from "react";
import {
    FlatList,
    Keyboard,
    Modal,
    Pressable,
    StyleSheet,
    View,
    type StyleProp,
    type ViewStyle,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export interface SelectOption {
  label: string;
  value: string;
}

interface SelectFieldProps {
  label?: string;
  title?: string;
  placeholder?: string;
  options: readonly SelectOption[];
  value?: string;
  onChange: (value: string) => void;
  searchable?: boolean;
  error?: string;
  icon?: keyof typeof Ionicons.glyphMap;
  containerStyle?: StyleProp<ViewStyle>;
}

interface SheetProps {
  visible: boolean;
  title: string;
  options: readonly SelectOption[];
  value?: string;
  searchable: boolean;
  onSelect: (value: string) => void;
  onClose: () => void;
}

function SelectSheet({
  visible,
  title,
  options,
  value,
  searchable,
  onSelect,
  onClose,
}: SheetProps) {
  const insets = useSafeAreaInsets();
  const [query, setQuery] = useState("");
  const [keyboard, setKeyboard] = useState(0);

  // Modals do not resize with the keyboard on every phone, so lift the sheet by hand
  useEffect(() => {
    const show = Keyboard.addListener("keyboardDidShow", (e) =>
      setKeyboard(e.endCoordinates.height),
    );
    const hide = Keyboard.addListener("keyboardDidHide", () => setKeyboard(0));
    return () => {
      show.remove();
      hide.remove();
    };
  }, []);

  useEffect(() => {
    if (!visible) setQuery("");
  }, [visible]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q
      ? options.filter((o) => o.label.toLowerCase().includes(q))
      : options;
  }, [options, query]);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <Pressable
          style={styles.backdrop}
          onPress={onClose}
          accessibilityLabel="Close"
        />

        <View
          style={[
            styles.sheet,
            { paddingBottom: Math.max(keyboard, insets.bottom) + spacing.md },
          ]}
        >
          <View style={styles.handle} />
          <AppText variant="h2" style={styles.sheetTitle}>
            {title}
          </AppText>

          {searchable ? (
            <Input
              icon="search-outline"
              placeholder="Search"
              value={query}
              onChangeText={setQuery}
              autoCapitalize="none"
              autoCorrect={false}
              containerStyle={styles.search}
            />
          ) : null}

          <FlatList
            data={filtered}
            keyExtractor={(item) => item.value}
            keyboardShouldPersistTaps="handled"
            style={styles.list}
            ListEmptyComponent={
              <AppText variant="body" color="textMuted" style={styles.empty}>
                No matches
              </AppText>
            }
            renderItem={({ item }) => {
              const selected = item.value === value;
              return (
                <Pressable
                  onPress={() => {
                    onSelect(item.value);
                    onClose();
                  }}
                  accessibilityRole="button"
                  accessibilityState={{ selected }}
                  style={({ pressed }) => [
                    styles.row,
                    pressed && styles.rowPressed,
                  ]}
                >
                  <AppText variant={selected ? "bodyMedium" : "body"}>
                    {item.label}
                  </AppText>
                  {selected ? (
                    <Ionicons name="checkmark" size={20} color={colors.ink} />
                  ) : null}
                </Pressable>
              );
            }}
          />
        </View>
      </View>
    </Modal>
  );
}

export function SelectField({
  label,
  title,
  placeholder,
  options,
  value,
  onChange,
  searchable = false,
  error,
  icon,
  containerStyle,
}: SelectFieldProps) {
  const [open, setOpen] = useState(false);
  const selected = options.find((o) => o.value === value);

  return (
    <View style={containerStyle}>
      {label ? (
        <AppText variant="label" style={styles.label}>
          {label}
        </AppText>
      ) : null}

      <Pressable
        onPress={() => setOpen(true)}
        accessibilityRole="button"
        accessibilityLabel={`${label ?? title ?? "Select"}: ${selected?.label ?? "not selected"}`}
        style={[styles.field, !!error && styles.errored]}
      >
        {icon ? (
          <Ionicons
            name={icon}
            size={20}
            color={colors.textSubtle}
            style={styles.leftIcon}
          />
        ) : null}
        <AppText
          variant="body"
          color={selected ? "text" : "textSubtle"}
          style={styles.value}
          numberOfLines={1}
        >
          {selected?.label ?? placeholder ?? "Select"}
        </AppText>
        <Ionicons name="chevron-down" size={20} color={colors.textMuted} />
      </Pressable>

      {error ? (
        <AppText variant="caption" color="danger" style={styles.helper}>
          {error}
        </AppText>
      ) : null}

      <SelectSheet
        visible={open}
        title={title ?? label ?? "Select"}
        options={options}
        value={value}
        searchable={searchable}
        onSelect={onChange}
        onClose={() => setOpen(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  label: { marginBottom: spacing.sm },
  field: {
    height: layout.inputHeight,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.field,
    borderWidth: 2,
    borderColor: "transparent",
    borderRadius: radius.md,
    paddingHorizontal: spacing.lg,
  },
  errored: { borderColor: colors.danger },
  leftIcon: { marginRight: spacing.md },
  value: { flex: 1 },
  helper: { marginTop: spacing.xs },

  overlay: { flex: 1, justifyContent: "flex-end" },
  backdrop: {
    ...StyleSheet.absoluteFill,
    backgroundColor: "rgba(2, 44, 34, 0.55)",
  },
  sheet: {
    backgroundColor: colors.paper,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    paddingTop: spacing.md,
    paddingHorizontal: spacing.xl,
    maxHeight: "80%",
  },
  handle: {
    alignSelf: "center",
    width: 40,
    height: 4,
    borderRadius: radius.pill,
    backgroundColor: colors.champagneDeep,
    marginBottom: spacing.lg,
  },
  sheetTitle: { marginBottom: spacing.md },
  search: { marginBottom: spacing.sm },
  list: { flexGrow: 0 },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
  },
  rowPressed: { backgroundColor: colors.champagne },
  empty: { paddingVertical: spacing.xl },
});
