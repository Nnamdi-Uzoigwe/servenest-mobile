import { TabScaffold } from "@/components/shell/TabScaffold";
import { EmptyState } from "@/components/ui";

export default function TechnicianEarnings() {
  return (
    <TabScaffold title="Earnings" subtitle="Payouts and completed jobs">
      <EmptyState
        icon="wallet-outline"
        title="No earnings yet"
        message="Completed jobs and payouts will be listed here."
      />
    </TabScaffold>
  );
}
