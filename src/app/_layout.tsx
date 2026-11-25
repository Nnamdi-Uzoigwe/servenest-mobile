import { queryClient } from "@/lib/queryClient";
import { useAuthStore } from "@/store/authStore";
import { colors } from "@/theme";
import {
  BricolageGrotesque_700Bold,
  BricolageGrotesque_800ExtraBold,
} from "@expo-google-fonts/bricolage-grotesque";
import {
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  useFonts,
} from "@expo-google-fonts/poppins";
import { QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";

SplashScreen.preventAutoHideAsync();

function RootNavigator() {
  const status = useAuthStore((s) => s.status);
  const role = useAuthStore((s) => s.user?.role);
  const verified = useAuthStore((s) => !!s.user?.isEmailVerified);
  const signedIn = status === "signedIn";

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.paper },
      }}
    >
      {/* Always available: decides where to send the person */}
      <Stack.Screen name="index" />

      <Stack.Protected guard={!signedIn}>
        <Stack.Screen name="(auth)" />
      </Stack.Protected>

      {/* Signed in, but the email is not verified yet: both roles land here */}
      <Stack.Protected guard={signedIn && !verified}>
        <Stack.Screen name="(verify)" />
      </Stack.Protected>

      <Stack.Protected guard={signedIn && verified && role === "customer"}>
        <Stack.Screen name="(customer)" />
      </Stack.Protected>

      <Stack.Protected guard={signedIn && verified && role === "technician"}>
        <Stack.Screen name="(technician)" />
      </Stack.Protected>
    </Stack>
  );
}

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    BricolageGrotesque_700Bold,
    BricolageGrotesque_800ExtraBold,
  });

  const status = useAuthStore((s) => s.status);
  const bootstrap = useAuthStore((s) => s.bootstrap);

  useEffect(() => {
    bootstrap();
  }, [bootstrap]);

  const ready = (fontsLoaded || !!fontError) && status !== "loading";

  useEffect(() => {
    if (ready) SplashScreen.hideAsync();
  }, [ready]);

  if (!ready) return null;

  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaProvider>
        <StatusBar style="dark" />
        <RootNavigator />
      </SafeAreaProvider>
    </QueryClientProvider>
  );
}
