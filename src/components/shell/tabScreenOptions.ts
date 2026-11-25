import { colors, fonts } from "@/theme";

export const tabScreenOptions = {
  headerShown: false,
  tabBarActiveTintColor: colors.onInk,
  tabBarInactiveTintColor: colors.onInkMuted,
  tabBarStyle: {
    backgroundColor: colors.ink,
    borderTopWidth: 0,
    elevation: 0,
    paddingTop: 6,
  },
  tabBarLabelStyle: { fontFamily: fonts.medium, fontSize: 11 },
};
