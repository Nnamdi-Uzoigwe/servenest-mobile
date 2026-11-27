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

export type DocumentType = "id_card" | "certificate" | "license" | "other";

export interface TechnicianDocument {
  _id: string;
  type: DocumentType;
  name: string;
  url: string;
  publicId: string;
  uploadedAt: string;
}

export interface TechnicianProfile extends TechnicianSummary {
  user: string;
  residentialAddress: string;
  bio?: string;
  yearsOfExperience: number;
  specializations: string[];
  workingLocations: WorkingLocation[];
  weeklyAvailability: AvailabilitySlot[];
  documents: TechnicianDocument[];
  createdAt: string;
  updatedAt: string;
}

export type IconKey =
  | "plumbing"
  | "electrical"
  | "ac"
  | "cleaning"
  | "generator"
  | "painting"
  | "appliance"
  | "carpentry"
  | "pest"
  | "maintenance"
  | "other";

export interface CatalogImage {
  url: string;
  publicId: string;
}

export interface CatalogCategory {
  _id: string;
  name: string;
  slug: string;
  description: string;
  iconKey: IconKey;
  image?: CatalogImage;
  sortOrder: number;
  serviceCount: number;
}

export interface CatalogCategoryRef {
  _id: string;
  name: string;
  slug: string;
  iconKey: IconKey;
}

export interface CatalogService {
  _id: string;
  category: CatalogCategoryRef;
  name: string;
  slug: string;
  description: string;
  image?: CatalogImage;
  // Whole kobo, so 850000 means 8,500 naira
  startingPrice: number;
  pricingNote: string;
  estimatedDurationMinutes: number;
  isAvailable: boolean;
  isFeatured: boolean;
}

export interface CatalogServiceList {
  items: CatalogService[];
  pagination: { page: number; limit: number; total: number; pages: number };
}
