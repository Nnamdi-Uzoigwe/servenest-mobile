import {
    AppText,
    Avatar,
    Button,
    Loader,
    Notice,
    Panel,
} from "@/components/ui";
import { cloudinaryThumb } from "@/lib/cloudinary";
import { useAvatarUpload } from "@/lib/useAvatarUpload";
import { useDocumentUpload } from "@/lib/useDocumentUpload";
import { useTechnicianProfile } from "@/lib/useTechnicianProfile";
import { useAuthStore } from "@/store/authStore";
import { colors, radius, spacing } from "@/theme";
import type { DocumentType } from "@/types/api";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import type { ReactNode } from "react";
import {
    ActivityIndicator,
    Alert,
    Pressable,
    StyleSheet,
    View,
} from "react-native";

type Source = "library" | "camera";

interface Slot {
  type: DocumentType;
  title: string;
  hint: string;
  docName: string;
  required: boolean;
  max: number;
  addLabel: string;
}

const SLOTS: Slot[] = [
  {
    type: "id_card",
    title: "Government ID",
    hint: "Required. A clear photo of your national ID, driver's licence or passport.",
    docName: "Government ID",
    required: true,
    max: 1,
    addLabel: "Add photo of ID",
  },
  {
    type: "certificate",
    title: "Trade certificate",
    hint: "Optional. A training certificate, trade licence or similar.",
    docName: "Trade certificate",
    required: false,
    max: 3,
    addLabel: "Add certificate",
  },
];

function chooseSource(title: string, onPick: (source: Source) => void) {
  Alert.alert(title, undefined, [
    { text: "Choose from gallery", onPress: () => onPick("library") },
    { text: "Take a photo", onPress: () => onPick("camera") },
    { text: "Cancel", style: "cancel" },
  ]);
}

function Card({
  title,
  hint,
  done,
  children,
}: {
  title: string;
  hint: string;
  done: boolean;
  children: ReactNode;
}) {
  return (
    <Panel tone="champagne" style={styles.card}>
      <View style={styles.head}>
        <View style={[styles.mark, done && styles.markDone]}>
          {done ? (
            <Ionicons name="checkmark" size={16} color={colors.onInk} />
          ) : null}
        </View>
        <View style={styles.headText}>
          <AppText variant="h3">{title}</AppText>
          <AppText variant="caption" color="textMuted">
            {hint}
          </AppText>
        </View>
      </View>
      {children}
    </Panel>
  );
}

export function ApplicationChecklist() {
  const user = useAuthStore((s) => s.user);
  const { data: profile, isLoading, isError, refetch } = useTechnicianProfile();
  const avatar = useAvatarUpload();
  const docs = useDocumentUpload();

  if (!user) return null;
  if (isLoading) return <Loader />;

  if (isError || !profile) {
    return (
      <View>
        <Notice message="We could not load your documents." />
        <Button
          title="Try again"
          variant="tonal"
          size="md"
          fullWidth={false}
          onPress={() => refetch()}
          style={styles.retry}
        />
      </View>
    );
  }

  const error = avatar.error || docs.error;

  function confirmRemove(id: string) {
    Alert.alert("Remove this document?", "You can add it again later.", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Remove",
        style: "destructive",
        onPress: () => void docs.remove(id),
      },
    ]);
  }

  return (
    <View>
      <AppText variant="h2" style={styles.heading}>
        Complete your application
      </AppText>

      {error ? (
        <View style={styles.notice}>
          <Notice message={error} />
        </View>
      ) : null}

      <Card
        title="Profile photo"
        hint="Recommended. Customers see it when you arrive."
        done={!!user.avatar?.url}
      >
        <View style={styles.photoRow}>
          <Avatar name={user.fullName} uri={user.avatar?.url} size={56} />
          <Button
            title={user.avatar?.url ? "Change photo" : "Add photo"}
            variant="tonal"
            size="md"
            fullWidth={false}
            loading={avatar.uploading}
            onPress={() =>
              chooseSource("Profile photo", (s) => void avatar.pick(s))
            }
          />
        </View>
      </Card>

      {SLOTS.map((slot) => {
        const items = profile.documents.filter((d) => d.type === slot.type);

        return (
          <Card
            key={slot.type}
            title={slot.title}
            hint={slot.hint}
            done={items.length > 0}
          >
            {items.length > 0 ? (
              <View style={styles.thumbs}>
                {items.map((doc) => (
                  <View key={doc._id} style={styles.thumbWrap}>
                    <Image
                      source={{ uri: cloudinaryThumb(doc.url, 84) }}
                      style={styles.thumb}
                      contentFit="cover"
                      accessibilityLabel={doc.name}
                    />
                    <Pressable
                      onPress={() => confirmRemove(doc._id)}
                      disabled={docs.busy !== null}
                      hitSlop={8}
                      accessibilityRole="button"
                      accessibilityLabel={`Remove ${doc.name}`}
                      style={styles.remove}
                    >
                      {docs.busy === doc._id ? (
                        <ActivityIndicator size="small" color={colors.onInk} />
                      ) : (
                        <Ionicons name="close" size={14} color={colors.onInk} />
                      )}
                    </Pressable>
                  </View>
                ))}
              </View>
            ) : null}

            {items.length < slot.max ? (
              <Button
                title={slot.addLabel}
                variant={slot.required ? "primary" : "tonal"}
                size="md"
                fullWidth={false}
                icon="camera-outline"
                loading={docs.busy === slot.type}
                disabled={docs.busy !== null && docs.busy !== slot.type}
                onPress={() =>
                  chooseSource(
                    slot.title,
                    (s) => void docs.add(slot.type, slot.docName, s),
                  )
                }
                style={items.length > 0 ? styles.addGap : undefined}
              />
            ) : null}
          </Card>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  heading: { marginBottom: spacing.lg },
  notice: { marginBottom: spacing.lg },
  retry: { marginTop: spacing.md },
  card: { marginBottom: spacing.md },
  head: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: spacing.lg,
  },
  mark: {
    width: 26,
    height: 26,
    borderRadius: radius.pill,
    backgroundColor: colors.champagneDeep,
    alignItems: "center",
    justifyContent: "center",
    marginRight: spacing.md,
    marginTop: 1,
  },
  markDone: { backgroundColor: colors.ink },
  headText: { flex: 1 },
  photoRow: { flexDirection: "row", alignItems: "center", gap: spacing.lg },
  thumbs: { flexDirection: "row", flexWrap: "wrap", gap: spacing.md },
  thumbWrap: { width: 84, height: 84 },
  thumb: {
    width: 84,
    height: 84,
    borderRadius: radius.md,
    backgroundColor: colors.champagneDeep,
  },
  remove: {
    position: "absolute",
    top: -6,
    right: -6,
    width: 24,
    height: 24,
    borderRadius: radius.pill,
    backgroundColor: colors.ink,
    borderWidth: 2,
    borderColor: colors.champagne,
    alignItems: "center",
    justifyContent: "center",
  },
  addGap: { marginTop: spacing.lg },
});
