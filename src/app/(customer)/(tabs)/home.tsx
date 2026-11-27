import { CatalogHome } from "@/components/catalog/CatalogHome";
import { TabScaffold } from "@/components/shell/TabScaffold";
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
      <CatalogHome />
    </TabScaffold>
  );
}
