import { useAuthStore } from "@/store/authStore";
import { Redirect } from "expo-router";

export default function Index() {
  const status = useAuthStore((s) => s.status);
  const role = useAuthStore((s) => s.user?.role);
  const approval = useAuthStore((s) => s.technicianProfile?.approvalStatus);

  if (status !== "signedIn") return <Redirect href="/welcome" />;
  if (role === "customer") return <Redirect href="/home" />;
  return (
    <Redirect
      href={approval === "approved" ? "/dashboard" : "/approval-status"}
    />
  );
}
