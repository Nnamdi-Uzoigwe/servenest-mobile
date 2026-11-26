import { api } from "@/lib/api";
import type { TechnicianProfile } from "@/types/api";
import { useQuery } from "@tanstack/react-query";

export const technicianProfileKey = ["technician", "me"] as const;

export function useTechnicianProfile() {
  return useQuery({
    queryKey: technicianProfileKey,
    queryFn: () => api.get<TechnicianProfile>("/technicians/me"),
  });
}
