import {
    AppText,
    BackButton,
    Button,
    Chip,
    Input,
    Loader,
    Notice,
    Screen,
    SelectField,
} from "@/components/ui";
import { STATE_OPTIONS } from "@/constants/nigeria";
import { SERVICE_TYPES } from "@/constants/services";
import { WEEKDAYS, WORK_WEEK } from "@/constants/weekdays";
import { api, errorMessage } from "@/lib/api";
import { TIME_OPTIONS } from "@/lib/time";
import {
    technicianProfileKey,
    useTechnicianProfile,
} from "@/lib/useTechnicianProfile";
import { useAuthStore } from "@/store/authStore";
import { spacing } from "@/theme";
import type { TechnicianProfile, Weekday, WorkingLocation } from "@/types/api";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { useState } from "react";
import { StyleSheet, View } from "react-native";

interface Errors {
  address?: string;
  years?: string;
  bio?: string;
  services?: string;
  areas?: string;
  days?: string;
  time?: string;
  form?: string;
}

function EditForm({ profile }: { profile: TechnicianProfile }) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const refreshMe = useAuthStore((s) => s.refreshMe);
  const rejected = profile.approvalStatus === "rejected";

  const slots = profile.weeklyAvailability;
  const [address, setAddress] = useState(profile.residentialAddress);
  const [years, setYears] = useState(String(profile.yearsOfExperience));
  const [bio, setBio] = useState(profile.bio ?? "");
  const [specs, setSpecs] = useState<string[]>(profile.specializations);
  const [areas, setAreas] = useState<WorkingLocation[]>(
    profile.workingLocations,
  );
  const [days, setDays] = useState<Weekday[]>(
    slots.length ? slots.map((s) => s.day) : WORK_WEEK,
  );
  const [startTime, setStartTime] = useState(slots[0]?.startTime ?? "08:00");
  const [endTime, setEndTime] = useState(slots[0]?.endTime ?? "17:00");

  const [state, setState] = useState<string | undefined>();
  const [city, setCity] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [saving, setSaving] = useState(false);

  // Keep services the technician already has, even if they are not in the standard list
  const known = SERVICE_TYPES as readonly string[];
  const serviceOptions = [
    ...SERVICE_TYPES,
    ...specs.filter((s) => !known.includes(s)),
  ];

  function toggleSpec(name: string) {
    setErrors((e) => ({ ...e, services: undefined }));
    setSpecs((s) =>
      s.includes(name)
        ? s.filter((x) => x !== name)
        : s.length < 10
          ? [...s, name]
          : s,
    );
  }

  function toggleDay(day: Weekday) {
    setErrors((e) => ({ ...e, days: undefined }));
    setDays((d) =>
      d.includes(day) ? d.filter((x) => x !== day) : [...d, day],
    );
  }

  // Returns the new list so Save can use it straight away
  function addArea(): WorkingLocation[] | null {
    const cleanCity = city.trim();
    if (!state || cleanCity.length < 2) {
      setErrors((e) => ({
        ...e,
        areas: "Pick a state and enter a city or area",
      }));
      return null;
    }
    if (areas.length >= 10) {
      setErrors((e) => ({ ...e, areas: "You can add up to 10 areas" }));
      return null;
    }
    if (
      areas.some(
        (a) =>
          a.state === state && a.city.toLowerCase() === cleanCity.toLowerCase(),
      )
    ) {
      setErrors((e) => ({ ...e, areas: "You already added that area" }));
      return null;
    }

    const next = [...areas, { state, city: cleanCity }];
    setAreas(next);
    setCity("");
    setErrors((e) => ({ ...e, areas: undefined }));
    return next;
  }

  async function save() {
    let currentAreas = areas;
    if (state && city.trim().length >= 2) {
      const added = addArea();
      if (!added) return;
      currentAreas = added;
    }

    const found: Errors = {};
    const trimmedAddress = address.trim();
    const yearsNumber = Number(years);

    if (trimmedAddress.length < 5) found.address = "Enter your full address";
    if (
      years === "" ||
      !Number.isInteger(yearsNumber) ||
      yearsNumber < 0 ||
      yearsNumber > 60
    ) {
      found.years = "Enter whole years, from 0 to 60";
    }
    if (specs.length === 0) found.services = "Choose at least one service";
    if (currentAreas.length === 0)
      found.areas = "Add at least one area where you work";
    if (days.length === 0) found.days = "Choose at least one day";
    if (endTime <= startTime) found.time = "End time must be after start time";

    setErrors(found);
    if (Object.keys(found).length) return;

    const body = {
      residentialAddress: trimmedAddress,
      bio: bio.trim(),
      yearsOfExperience: yearsNumber,
      specializations: specs,
      workingLocations: currentAreas,
      weeklyAvailability: WEEKDAYS.filter((d) => days.includes(d.value)).map(
        (d) => ({
          day: d.value,
          startTime,
          endTime,
        }),
      ),
    };

    setSaving(true);
    try {
      // A rejected application goes back to pending in the same call
      if (rejected) await api.post("/technicians/me/resubmit", body);
      else await api.patch("/technicians/me", body);

      await refreshMe();
      await queryClient.invalidateQueries({ queryKey: technicianProfileKey });
      router.back();
    } catch (err) {
      setErrors({ form: errorMessage(err) });
      setSaving(false);
    }
  }

  return (
    <Screen scroll avoidKeyboard contentContainerStyle={styles.content}>
      <BackButton />

      <AppText variant="h1" style={styles.title}>
        {rejected ? "Fix and resubmit" : "Edit your details"}
      </AppText>
      <AppText variant="body" color="textMuted" style={styles.sub}>
        {rejected
          ? "Update anything the admin team asked for, then resubmit your application."
          : "Changes are saved to your application while it is under review."}
      </AppText>

      {errors.form ? (
        <View style={styles.notice}>
          <Notice message={errors.form} />
        </View>
      ) : null}

      <Input
        label="Residential address"
        icon="home-outline"
        value={address}
        onChangeText={(v) => {
          setAddress(v);
          setErrors((e) => ({ ...e, address: undefined }));
        }}
        error={errors.address}
        containerStyle={styles.field}
      />
      <Input
        label="Years of experience"
        icon="time-outline"
        value={years}
        onChangeText={(v) => {
          setYears(v.replace(/\D/g, "").slice(0, 2));
          setErrors((e) => ({ ...e, years: undefined }));
        }}
        error={errors.years}
        keyboardType="number-pad"
        containerStyle={styles.field}
      />
      <Input
        label="Short bio (optional)"
        value={bio}
        onChangeText={setBio}
        error={errors.bio}
        hint={`${bio.length}/1000`}
        multiline
        maxLength={1000}
        containerStyle={styles.field}
      />

      <AppText variant="label" style={styles.label}>
        Services you handle
      </AppText>
      <View style={styles.chips}>
        {serviceOptions.map((name) => (
          <Chip
            key={name}
            label={name}
            selected={specs.includes(name)}
            onPress={() => toggleSpec(name)}
          />
        ))}
      </View>
      {errors.services ? (
        <AppText variant="caption" color="danger" style={styles.error}>
          {errors.services}
        </AppText>
      ) : null}

      <AppText variant="label" style={[styles.label, styles.sectionGap]}>
        Where you work
      </AppText>
      {areas.length > 0 ? (
        <View style={[styles.chips, styles.areaChips]}>
          {areas.map((a, i) => (
            <Chip
              key={`${a.state}-${a.city}`}
              label={`${a.city}, ${a.state}`}
              onRemove={() =>
                setAreas((list) => list.filter((_, idx) => idx !== i))
              }
            />
          ))}
        </View>
      ) : null}
      <SelectField
        title="Choose a state"
        placeholder="Choose a state"
        icon="location-outline"
        options={STATE_OPTIONS}
        value={state}
        onChange={(v) => {
          setState(v);
          setErrors((e) => ({ ...e, areas: undefined }));
        }}
        searchable
        containerStyle={styles.smallGap}
      />
      <Input
        placeholder="City or area, for example Wuse 2"
        icon="navigate-outline"
        value={city}
        onChangeText={(v) => {
          setCity(v);
          setErrors((e) => ({ ...e, areas: undefined }));
        }}
        autoCapitalize="words"
        returnKeyType="done"
        onSubmitEditing={() => addArea()}
        containerStyle={styles.smallGap}
      />
      <Button
        title="Add area"
        variant="tonal"
        size="md"
        fullWidth={false}
        icon="add"
        onPress={() => addArea()}
      />
      {errors.areas ? (
        <AppText variant="caption" color="danger" style={styles.error}>
          {errors.areas}
        </AppText>
      ) : null}

      <AppText variant="label" style={[styles.label, styles.sectionGap]}>
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
      {errors.days ? (
        <AppText variant="caption" color="danger" style={styles.error}>
          {errors.days}
        </AppText>
      ) : null}

      <View style={styles.times}>
        <SelectField
          title="Start time"
          label="From"
          options={TIME_OPTIONS}
          value={startTime}
          onChange={(v) => {
            setStartTime(v);
            setErrors((e) => ({ ...e, time: undefined }));
          }}
          containerStyle={styles.time}
        />
        <SelectField
          title="End time"
          label="Until"
          options={TIME_OPTIONS}
          value={endTime}
          onChange={(v) => {
            setEndTime(v);
            setErrors((e) => ({ ...e, time: undefined }));
          }}
          error={errors.time}
          containerStyle={styles.time}
        />
      </View>

      <Button
        title={rejected ? "Save and resubmit" : "Save changes"}
        loading={saving}
        onPress={save}
        style={styles.submit}
      />
    </Screen>
  );
}

export default function EditApplication() {
  const { data, isLoading, isError, refetch } = useTechnicianProfile();

  if (isLoading) {
    return (
      <Screen>
        <Loader />
      </Screen>
    );
  }

  if (isError || !data) {
    return (
      <Screen contentContainerStyle={styles.content}>
        <BackButton />
        <View style={styles.sub}>
          <Notice message="We could not load your application." />
          <Button
            title="Try again"
            variant="tonal"
            size="md"
            fullWidth={false}
            onPress={() => refetch()}
            style={styles.retry}
          />
        </View>
      </Screen>
    );
  }

  return <EditForm profile={data} />;
}

const styles = StyleSheet.create({
  content: { paddingTop: spacing.md, paddingBottom: spacing.xl },
  title: { marginTop: spacing.xxl },
  sub: { marginTop: spacing.xs, marginBottom: spacing.xl },
  notice: { marginBottom: spacing.lg },
  field: { marginBottom: spacing.lg },
  label: { marginBottom: spacing.md },
  sectionGap: { marginTop: spacing.xxl },
  chips: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm },
  areaChips: { marginBottom: spacing.lg },
  smallGap: { marginBottom: spacing.md },
  error: { marginTop: spacing.sm },
  times: { flexDirection: "row", gap: spacing.md, marginTop: spacing.lg },
  time: { flex: 1 },
  submit: { marginTop: spacing.xxl },
  retry: { marginTop: spacing.md },
});
