import { z } from "zod";

export const vendorFormSchema = z.object({
  name: z.string().min(1, "Business name is required"),
  mobile: z.string().optional(),
  website: z.string().url().optional().or(z.literal("")),
  logo: z.string().url().optional().or(z.literal("")),
  banner: z.string().url().optional().or(z.literal("")),
  radius: z.number().optional().nullable(),
  address: z
    .object({
      place_id: z.string().optional().nullable(),
      address_line_1: z.string().optional().nullable(),
      address_line_2: z.string().optional().nullable(),
      city: z.string().optional().nullable(),
      state: z.string().optional().nullable(),
      postal_code: z.string().optional().nullable(),
      country: z.string().optional().nullable(),
      address: z.string(),
      latitude: z.number(),
      longitude: z.number(),
    })
    .refine((value) => value, { message: "Address is required" }),
  serves_breakfast: z.boolean().default(false),
  amenities: z.array(z.string()).optional(),
  operation_hours: z.array(
    z.object({
      day_of_week: z.string(),
      from: z.string().optional().nullable(),
      to: z.string().optional().nullable(),
      close: z.boolean(),
    })
  ),
});

export type VendorFormValues = z.infer<typeof vendorFormSchema>;

export const vendorEditSchema = z.object({
  name: z.string().min(1, "Business name is required"),
  mobile: z.string().optional(),
  website: z.string().url().optional().or(z.literal("")),
  logo: z.string().url().optional().or(z.literal("")),
  banner: z.string().url().optional().or(z.literal("")),
  radius: z.number().optional().nullable(),
  address: z
    .object({
      place_id: z.string().optional().nullable(),
      address_line_1: z.string().optional().nullable(),
      address_line_2: z.string().optional().nullable(),
      city: z.string().optional().nullable(),
      state: z.string().optional().nullable(),
      postal_code: z.string().optional().nullable(),
      country: z.string().optional().nullable(),
      address: z.string(),
      latitude: z.number(),
      longitude: z.number(),
    })
    .partial()
    .refine((value) => value, { message: "Address is required" }),
  serves_breakfast: z.boolean().default(false),
  amenities: z.array(z.string()).optional(),
});

export type VendorEditValues = z.infer<typeof vendorEditSchema>;

export const operatingHourSchema = z.object({
  operation_hours: z.array(
    z.object({
      day_of_week: z.string(),
      from: z.string().optional().nullable(),
      to: z.string().optional().nullable(),
      close: z.boolean(),
    })
  ),
});

export type OperatingHourValues = z.infer<typeof operatingHourSchema>;

export const defaultValues = {
  name: "",
  mobile: "",
  website: "",
  logo: "",
  banner: "",
  radius: null,
  serves_breakfast: false,
  amenities: [],
  address: {
    place_id: null,
    address_line_1: null,
    address_line_2: null,
    city: null,
    state: null,
    postal_code: null,
    country: null,
    address: "",
    latitude: 0,
    longitude: 0,
  },
  operation_hours: [
    { day_of_week: "MONDAY", from: "", to: "", close: true },
    { day_of_week: "TUESDAY", from: "", to: "", close: true },
    { day_of_week: "WEDNESDAY", from: "", to: "", close: true },
    { day_of_week: "THURSDAY", from: "", to: "", close: true },
    { day_of_week: "FRIDAY", from: "", to: "", close: true },
    { day_of_week: "SATURDAY", from: "", to: "", close: true },
    { day_of_week: "SUNDAY", from: "", to: "", close: true },
  ],
};
