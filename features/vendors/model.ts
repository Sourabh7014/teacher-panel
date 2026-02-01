import { Amenity } from "../amenities/model";

export enum VendorStatus {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
  DEACTIVATED = "DEACTIVATED",
}

export interface Vendor {
  id: string;
  name: string;
  mobile?: string;
  website?: string;
  serves_breakfast: boolean;
  latitude: number;
  longitude: number;
  status: VendorStatus;
  radius?: number;
  logo?: string;
  banner?: string;
  created_at: number;
  address?: Address;
  amenities?: Amenity[];
  operation_hours?: OperationHour[];
}

export interface Address {
  address: string;
  address_line_1: string;
  address_line_2: string;
  city: string;
  state: string;
  country: string;
  postal_code: string;
  latitude: number;
  longitude: number;
}

export interface OperationHour {
  day_of_week: DayOfWeek;
  from: string;
  to: string;
  close: boolean;
}

export type DayOfWeek =
  | "MONDAY"
  | "TUESDAY"
  | "WEDNESDAY"
  | "THURSDAY"
  | "FRIDAY"
  | "SATURDAY"
  | "SUNDAY";
