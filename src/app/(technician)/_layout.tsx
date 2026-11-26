import { useAuthStore } from "@/store/authStore";
import { Stack } from "expo-router";

export default function TechnicianLayout() {
  const approved = useAuthStore(
    (s) => s.technicianProfile?.approvalStatus === "approved",
  );

  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* Business rule 3: no job screens until an admin approves the account */}
      <Stack.Protected guard={approved}>
        <Stack.Screen name="(tabs)" />
      </Stack.Protected>

      <Stack.Protected guard={!approved}>
        <Stack.Screen name="approval-status" />
        <Stack.Screen name="edit-application" />
      </Stack.Protected>
    </Stack>
  );
}
