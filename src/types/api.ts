export type Role = "customer" | "technician" | "admin" | "dispatcher";

export type TechnicianApprovalStatus =
  | "pending"
  | "approved"
  | "rejected"
  | "suspended";

export type Weekday =
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday"
  | "sunday";

export interface User {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  role: Role;
  status: "active" | "suspended";
  avatar?: { url: string; publicId: string };
  isEmailVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface TechnicianSummary {
  _id: string;
  approvalStatus: TechnicianApprovalStatus;
  rejectionReason?: string;
  suspensionReason?: string;
  isAvailable: boolean;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthResponse {
  user: User;
  technicianProfile: TechnicianSummary | null;
  tokens: AuthTokens;
}

export interface MeResponse {
  user: User;
  technicianProfile: TechnicianSummary | null;
}

export interface RegisterCustomerInput {
  fullName: string;
  email: string;
  phone?: string;
  password: string;
}

export interface WorkingLocation {
  state: string;
  city: string;
}

export interface AvailabilitySlot {
  day: Weekday;
  startTime: string; // "08:00"
  endTime: string; // "17:00"
}

export interface RegisterTechnicianInput extends RegisterCustomerInput {
  phone: string;
  residentialAddress: string;
  bio?: string;
  yearsOfExperience: number;
  specializations: string[];
  workingLocations: WorkingLocation[];
  weeklyAvailability?: AvailabilitySlot[];
}
