import { TabScaffold } from "@/components/shell/TabScaffold";
import { EmptyState } from "@/components/ui";
import { useAuthStore } from "@/store/authStore";

export default function CustomerHome() {
  const firstName = useAuthStore(
    (s) => s.user?.fullName.split(" ")[0] ?? "there",
  );

  return (
    <TabScaffold
      title={`Hello, ${firstName}`}
      subtitle="What needs fixing today?"
    >
      <EmptyState
        icon="construct-outline"
        title="Services are on the way"
        message="You will browse and book home services here once the booking system is built."
      />
    </TabScaffold>
  );
}
