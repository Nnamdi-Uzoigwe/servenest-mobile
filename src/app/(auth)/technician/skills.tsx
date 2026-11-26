import { TechnicianStepHeader } from "@/components/onboarding/TechnicianStepHeader";
import {
    AppText,
    Button,
    Chip,
    Input,
    Screen,
    SelectField,
} from "@/components/ui";
import { STATE_OPTIONS } from "@/constants/nigeria";
import { SERVICE_TYPES } from "@/constants/services";
import { useApplicationStore } from "@/store/technicianApplicationStore";
import { spacing } from "@/theme";
import type { WorkingLocation } from "@/types/api";
import { useRouter } from "expo-router";
import { useState } from "react";
import { StyleSheet, View } from "react-native";

const MAX_SPECIALIZATIONS = 10;
const MAX_AREAS = 10;

const areaLabel = (a: WorkingLocation) =>
  `${a.city}, ${a.state === "FCT" ? "FCT" : a.state}`;

export default function TechnicianSkillsStep() {
  const router = useRouter();
  const { specializations, workingLocations, update } = useApplicationStore();

  const [state, setState] = useState<string | undefined>();
  const [city, setCity] = useState("");
  const [specError, setSpecError] = useState("");
  const [areaError, setAreaError] = useState("");

  function toggleSpec(name: string) {
    setSpecError("");
    const has = specializations.includes(name);
    update({
      specializations: has
        ? specializations.filter((s) => s !== name)
        : specializations.length < MAX_SPECIALIZATIONS
          ? [...specializations, name]
          : specializations,
    });
  }

  // Returns the new list so Continue can use it straight away
  function addArea(): WorkingLocation[] | null {
    const cleanCity = city.trim();
    if (!state || cleanCity.length < 2) {
      setAreaError("Pick a state and enter a city or area");
      return null;
    }
    if (workingLocations.length >= MAX_AREAS) {
      setAreaError(`You can add up to ${MAX_AREAS} areas`);
      return null;
    }
    const exists = workingLocations.some(
      (a) =>
        a.state === state && a.city.toLowerCase() === cleanCity.toLowerCase(),
    );
    if (exists) {
      setAreaError("You already added that area");
      return null;
    }

    const next = [...workingLocations, { state, city: cleanCity }];
    update({ workingLocations: next });
    setCity("");
    setAreaError("");
    return next;
  }

  function removeArea(index: number) {
    update({
      workingLocations: workingLocations.filter((_, i) => i !== index),
    });
  }

  function next() {
    let areas = workingLocations;

    // Someone filled in an area but did not tap Add, so add it for them
    if (state && city.trim().length >= 2) {
      const added = addArea();
      if (!added) return;
      areas = added;
    }

    const noSpec = specializations.length === 0;
    const noArea = areas.length === 0;
    setSpecError(noSpec ? "Choose at least one service" : "");
    setAreaError(noArea ? "Add at least one area where you work" : "");
    if (noSpec || noArea) return;

    router.push("/technician/availability");
  }

  return (
    <Screen scroll avoidKeyboard contentContainerStyle={styles.content}>
      <TechnicianStepHeader current={2} />

      <AppText variant="h1" style={styles.title}>
        Skills and areas
      </AppText>
      <AppText variant="body" color="textMuted" style={styles.sub}>
        Tell us what you do and where you work.
      </AppText>

      <AppText variant="label" style={styles.label}>
        Services you handle
      </AppText>
      <View style={styles.chips}>
        {SERVICE_TYPES.map((name) => (
          <Chip
            key={name}
            label={name}
            selected={specializations.includes(name)}
            onPress={() => toggleSpec(name)}
          />
        ))}
      </View>
      {specError ? (
        <AppText variant="caption" color="danger" style={styles.error}>
          {specError}
        </AppText>
      ) : null}

      <AppText variant="label" style={[styles.label, styles.areasLabel]}>
        Where you work
      </AppText>

      <SelectField
        title="Choose a state"
        placeholder="Choose a state"
        icon="location-outline"
        options={STATE_OPTIONS}
        value={state}
        onChange={(v) => {
          setState(v);
          setAreaError("");
        }}
        searchable
        containerStyle={styles.field}
      />
      <Input
        placeholder="City or area, for example Wuse 2"
        icon="navigate-outline"
        value={city}
        onChangeText={(v) => {
          setCity(v);
          if (areaError) setAreaError("");
        }}
        autoCapitalize="words"
        returnKeyType="done"
        onSubmitEditing={() => addArea()}
        containerStyle={styles.field}
      />
      <Button
        title="Add area"
        variant="tonal"
        size="md"
        fullWidth={false}
        icon="add"
        onPress={() => addArea()}
      />

      {areaError ? (
        <AppText variant="caption" color="danger" style={styles.error}>
          {areaError}
        </AppText>
      ) : null}

      {workingLocations.length > 0 ? (
        <View style={[styles.chips, styles.areaChips]}>
          {workingLocations.map((area, i) => (
            <Chip
              key={`${area.state}-${area.city}`}
              label={areaLabel(area)}
              onRemove={() => removeArea(i)}
            />
          ))}
        </View>
      ) : null}

      <Button title="Continue" onPress={next} style={styles.submit} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { paddingTop: spacing.md, paddingBottom: spacing.xl },
  title: { marginTop: spacing.xxl },
  sub: { marginTop: spacing.xs, marginBottom: spacing.xl },
  label: { marginBottom: spacing.md },
  areasLabel: { marginTop: spacing.xxl },
  chips: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm },
  areaChips: { marginTop: spacing.lg },
  field: { marginBottom: spacing.md },
  error: { marginTop: spacing.sm },
  submit: { marginTop: spacing.xxl },
});
