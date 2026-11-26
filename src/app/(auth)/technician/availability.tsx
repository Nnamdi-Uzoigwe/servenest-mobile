import { TechnicianStepHeader } from "@/components/onboarding/TechnicianStepHeader";
import { AppText, Button, Chip, Screen, SelectField } from "@/components/ui";
import { EVERY_DAY, WEEKDAYS, WORK_WEEK } from "@/constants/weekdays";
import { TIME_OPTIONS } from "@/lib/time";
import { useApplicationStore } from "@/store/technicianApplicationStore";
import { spacing } from "@/theme";
import type { Weekday } from "@/types/api";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";

export default function TechnicianAvailabilityStep() {
  const router = useRouter();
  const { days, startTime, endTime, update } = useApplicationStore();
  const [dayError, setDayError] = useState("");
  const [timeError, setTimeError] = useState("");

  function toggleDay(day: Weekday) {
    setDayError("");
    update({
      days: days.includes(day) ? days.filter((d) => d !== day) : [...days, day],
    });
  }

  function next() {
    // HH:mm strings compare correctly as text
    const badTime = endTime <= startTime;
    setDayError(days.length === 0 ? "Choose at least one day" : "");
    setTimeError(badTime ? "End time must be after start time" : "");
    if (days.length === 0 || badTime) return;

    router.push("/technician/review");
  }

  return (
    <Screen scroll contentContainerStyle={styles.content}>
      <TechnicianStepHeader current={3} />

      <AppText variant="h1" style={styles.title}>
        When can you work?
      </AppText>
      <AppText variant="body" color="textMuted" style={styles.sub}>
        You will only be offered jobs on these days and hours. You can change
        this later.
      </AppText>

      <AppText variant="label" style={styles.label}>
        Days
      </AppText>
      <View style={styles.chips}>
        {WEEKDAYS.map((d) => (
          <Chip
            key={d.value}
            label={d.short}
            accessibilityLabel={d.long}
            selected={days.includes(d.value)}
            onPress={() => toggleDay(d.value)}
          />
        ))}
      </View>

      <View style={styles.presets}>
        <Pressable
          onPress={() => {
            setDayError("");
            update({ days: WORK_WEEK });
          }}
          hitSlop={10}
        >
          <AppText variant="bodyMedium" color="ink">
            Weekdays
          </AppText>
        </Pressable>
        <Pressable
          onPress={() => {
            setDayError("");
            update({ days: EVERY_DAY });
          }}
          hitSlop={10}
        >
          <AppText variant="bodyMedium" color="ink">
            Every day
          </AppText>
        </Pressable>
      </View>

      {dayError ? (
        <AppText variant="caption" color="danger" style={styles.error}>
          {dayError}
        </AppText>
      ) : null}

      <AppText variant="label" style={[styles.label, styles.hoursLabel]}>
        Hours
      </AppText>
      <View style={styles.times}>
        <SelectField
          title="Start time"
          label="From"
          options={TIME_OPTIONS}
          value={startTime}
          onChange={(v) => {
            update({ startTime: v });
            setTimeError("");
          }}
          containerStyle={styles.time}
        />
        <SelectField
          title="End time"
          label="Until"
          options={TIME_OPTIONS}
          value={endTime}
          onChange={(v) => {
            update({ endTime: v });
            setTimeError("");
          }}
          error={timeError}
          containerStyle={styles.time}
        />
      </View>

      <Button title="Continue" onPress={next} style={styles.submit} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { paddingTop: spacing.md, paddingBottom: spacing.xl },
  title: { marginTop: spacing.xxl },
  sub: { marginTop: spacing.xs, marginBottom: spacing.xl },
  label: { marginBottom: spacing.md },
  chips: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm },
  presets: { flexDirection: "row", gap: spacing.xl, marginTop: spacing.lg },
  error: { marginTop: spacing.sm },
  hoursLabel: { marginTop: spacing.xxl, marginBottom: 0 },
  times: { flexDirection: "row", gap: spacing.md, marginTop: spacing.md },
  time: { flex: 1 },
  submit: { marginTop: spacing.xxl },
});
