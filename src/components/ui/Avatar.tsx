import { AppText } from "@/components/ui/AppText";
import { colors } from "@/theme";
import { Image } from "expo-image";
import { PixelRatio, StyleSheet, View } from "react-native";

interface AvatarProps {
  name: string;
  uri?: string;
  size?: number;
}

// Ask Cloudinary for a face-aware square at the size we actually show
function sized(uri: string, size: number) {
  if (!uri.includes("res.cloudinary.com") || !uri.includes("/upload/"))
    return uri;
  const px = Math.round(size * PixelRatio.get());
  return uri.replace(
    "/upload/",
    `/upload/c_fill,g_auto,w_${px},h_${px},f_auto,q_auto/`,
  );
}

export function Avatar({ name, uri, size = 56 }: AvatarProps) {
  const initials = name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]!.toUpperCase())
    .join("");

  return (
    <View
      style={[
        styles.circle,
        { width: size, height: size, borderRadius: size / 2 },
      ]}
      accessibilityLabel={`${name} profile photo`}
    >
      {uri ? (
        <Image
          source={{ uri: sized(uri, size) }}
          style={StyleSheet.absoluteFill}
          contentFit="cover"
          transition={200}
        />
      ) : (
        <AppText
          variant="h2"
          color="onInk"
          style={{ fontSize: size * 0.36, lineHeight: size * 0.44 }}
        >
          {initials}
        </AppText>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  circle: {
    backgroundColor: colors.ink,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
});
