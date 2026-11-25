import { AccountPanel } from "@/components/shell/AccountPanel";
import { TabScaffold } from "@/components/shell/TabScaffold";

export default function TechnicianProfile() {
  return (
    <TabScaffold title="Profile" subtitle="Your account">
      <AccountPanel />
    </TabScaffold>
  );
}
