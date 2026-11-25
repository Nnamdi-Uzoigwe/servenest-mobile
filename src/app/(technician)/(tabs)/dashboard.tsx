import { TabScaffold } from "@/components/shell/TabScaffold";
import { EmptyState } from "@/components/ui";
import { useAuthStore } from "@/store/authStore";

export default function TechnicianDashboard() {
  const firstName = useAuthStore(
    (s) => s.user?.fullName.split(" ")[0] ?? "there",
  );

  return (
    <TabScaffold title={`Hello, ${firstName}`} subtitle="Your jobs for today">
      <EmptyState
        icon="briefcase-outline"
        title="No jobs yet"
        message="New assignments from dispatch will appear here."
      />
    </TabScaffold>
  );
}
