import {
    TECHNICIAN_STEP_ROUTES,
    TechnicianStepHeader,
} from "@/components/onboarding/TechnicianStepHeader";
import { AppText, Button, Notice, Panel, Screen } from "@/components/ui";
import { summarizeDays, WEEKDAYS } from "@/constants/weekdays";
import { errorMessage } from "@/lib/api";
import { formatTime } from "@/lib/time";
import { useAuthStore } from "@/store/authStore";
import { useApplicationStore } from "@/store/technicianApplicationStore";
import { spacing } from "@/theme";
import { useRouter } from "expo-router";
import { useState, type ReactNode } from "react";
import { Pressable, StyleSheet, View } from "react-native";

function Section({
  title,
  step,
  children,
}: {
  title: string;
  step: number;
  children: ReactNode;
}) {
  const router = useRouter();

  return (
    <Panel tone="champagne" style={styles.section}>
      <View style={styles.sectionHead}>
        <AppText variant="h3">{title}</AppText>
        <Pressable
          onPress={() => router.navigate(TECHNICIAN_STEP_ROUTES[step])}
          hitSlop={10}
          accessibilityRole="button"
          accessibilityLabel={`Edit ${title}`}
        >
          <AppText variant="bodyMedium" color="ink">
            Edit
          </AppText>
        </Pressable>
      </View>
      {children}
    </Panel>
  );
}

function Line({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.line}>
      <AppText variant="caption" color="textMuted">
        {label}
      </AppText>
      <AppText variant="body">{value}</AppText>
    </View>
  );
}

export default function TechnicianReviewStep() {
  const router = useRouter();
  const registerTechnician = useAuthStore((s) => s.registerTechnician);
  const app = useApplicationStore();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function submit() {
    setLoading(true);
    setError("");

    try {
      // On success the route guards move the person to email verification
      await registerTechnician({
        fullName: app.fullName,
        email: app.email,
        phone: app.phone,
        password: app.password,
        residentialAddress: app.residentialAddress,
        bio: app.bio || undefined,
        yearsOfExperience: Number(app.yearsOfExperience),
        specializations: app.specializations,
        workingLocations: app.workingLocations,
        weeklyAvailability: WEEKDAYS.filter((d) =>
          app.days.includes(d.value),
        ).map((d) => ({
          day: d.value,
          startTime: app.startTime,
          endTime: app.endTime,
        })),
      });

      // Clear the saved answers, including the password, once the screen has gone
      setTimeout(app.reset, 500);
    } catch (err) {
      const message = errorMessage(err);

      if (/email/i.test(message) || /phone/i.test(message)) {
        // Send them back to the first step with the error on the right field
        app.update({
          accountError: {
            field: /email/i.test(message) ? "email" : "phone",
            message,
          },
        });
        router.navigate("/technician/signup");
      } else {
        setError(message);
      }
      setLoading(false);
    }
  }

  return (
    <Screen scroll contentContainerStyle={styles.content}>
      <TechnicianStepHeader current={4} />

      <AppText variant="h1" style={styles.title}>
        Review your application
      </AppText>
      <AppText variant="body" color="textMuted" style={styles.sub}>
        Check everything below. You can edit any section before you submit.
      </AppText>

      <Section title="Account" step={0}>
        <Line label="Name" value={app.fullName} />
        <Line label="Email" value={app.email} />
        <Line label="Phone" value={app.phone} />
      </Section>

      <Section title="About you" step={1}>
        <Line label="Address" value={app.residentialAddress} />
        <Line
          label="Experience"
          value={`${app.yearsOfExperience} ${app.yearsOfExperience === "1" ? "year" : "years"}`}
        />
        {app.bio ? <Line label="Bio" value={app.bio} /> : null}
      </Section>

      <Section title="Skills and areas" step={2}>
        <Line label="Services" value={app.specializations.join(", ")} />
        <Line
          label="Areas"
          value={app.workingLocations
            .map((a) => `${a.city}, ${a.state}`)
            .join("\n")}
        />
      </Section>

      <Section title="Availability" step={3}>
        <Line
          label="Days and hours"
          value={`${summarizeDays(app.days)}, ${formatTime(app.startTime)} to ${formatTime(app.endTime)}`}
        />
      </Section>

      <Notice
        tone="info"
        message="After you verify your email you will add your ID and certificates. An admin reviews everything before you can take jobs."
      />

      {error ? (
        <View style={styles.error}>
          <Notice message={error} />
        </View>
      ) : null}

      <Button
        title="Submit application"
        loading={loading}
        onPress={submit}
        style={styles.submit}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { paddingTop: spacing.md, paddingBottom: spacing.xl },
  title: { marginTop: spacing.xxl },
  sub: { marginTop: spacing.xs, marginBottom: spacing.xl },
  section: { marginBottom: spacing.lg },
  sectionHead: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.sm,
  },
  line: { marginTop: spacing.md },
  error: { marginTop: spacing.lg },
  submit: { marginTop: spacing.xl },
});
