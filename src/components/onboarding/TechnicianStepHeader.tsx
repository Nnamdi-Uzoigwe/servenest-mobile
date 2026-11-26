import { StepHeader } from "@/components/ui";
import { useRouter } from "expo-router";

// Account, About you, Skills and areas, Availability, Review, then Verify email
export const TECHNICIAN_TOTAL_STEPS = 6;

export const TECHNICIAN_STEP_ROUTES = [
  "/technician/signup",
  "/technician/about",
  "/technician/skills",
  "/technician/availability",
  "/technician/review",
] as const;

export function TechnicianStepHeader({ current }: { current: number }) {
  const router = useRouter();

  return (
    <StepHeader
      total={TECHNICIAN_TOTAL_STEPS}
      current={current}
      onSelect={(i) => router.navigate(TECHNICIAN_STEP_ROUTES[i])}
    />
  );
}
