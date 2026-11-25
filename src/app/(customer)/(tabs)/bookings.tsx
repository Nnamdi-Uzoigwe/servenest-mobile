import { TabScaffold } from "@/components/shell/TabScaffold";
import { EmptyState } from "@/components/ui";

export default function CustomerBookings() {
  return (
    <TabScaffold title="Bookings" subtitle="Your requests and jobs">
      <EmptyState
        icon="calendar-outline"
        title="No bookings yet"
        message="Services you book will appear here with their status."
      />
    </TabScaffold>
  );
}
