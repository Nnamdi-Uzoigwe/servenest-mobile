import { tabIcon } from "@/components/shell/tabIcon";
import { tabScreenOptions } from "@/components/shell/tabScreenOptions";
import { Tabs } from "expo-router";

export default function TechnicianTabs() {
  return (
    <Tabs screenOptions={tabScreenOptions}>
      <Tabs.Screen
        name="dashboard"
        options={{
          title: "Jobs",
          tabBarIcon: tabIcon("briefcase", "briefcase-outline"),
        }}
      />
      <Tabs.Screen
        name="earnings"
        options={{
          title: "Earnings",
          tabBarIcon: tabIcon("wallet", "wallet-outline"),
        }}
      />
      <Tabs.Screen
        name="tech-profile"
        options={{
          title: "Profile",
          tabBarIcon: tabIcon("person", "person-outline"),
        }}
      />
    </Tabs>
  );
}
