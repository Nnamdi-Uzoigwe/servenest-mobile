import { WORK_WEEK } from "@/constants/weekdays";
import type { Weekday, WorkingLocation } from "@/types/api";
import { create } from "zustand";

interface Fields {
  // Step 1
  fullName: string;
  email: string;
  phone: string;
  password: string;
  // Step 2
  residentialAddress: string;
  bio: string;
  yearsOfExperience: string;
  // Step 3
  specializations: string[];
  workingLocations: WorkingLocation[];
  // Step 4
  days: Weekday[];
  startTime: string;
  endTime: string;
  // Set when the server says the email or phone is taken, so step 1 can show it
  accountError: { field: "email" | "phone"; message: string } | null;
}

const initial: Fields = {
  fullName: "",
  email: "",
  phone: "",
  password: "",
  residentialAddress: "",
  bio: "",
  yearsOfExperience: "",
  specializations: [],
  workingLocations: [],
  days: WORK_WEEK,
  startTime: "08:00",
  endTime: "17:00",
  accountError: null,
};

interface ApplicationState extends Fields {
  update: (patch: Partial<Fields>) => void;
  reset: () => void;
}

// Held in memory only, never saved to the phone. The password is cleared on submit.
export const useApplicationStore = create<ApplicationState>((set) => ({
  ...initial,
  update: (patch) => set(patch),
  reset: () => set(initial),
}));
