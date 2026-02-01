"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
  Form,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useEffect } from "react";
import { toast } from "sonner";
import profileService from "@/features/profile/api.service";
import { cookieService } from "@/lib/cookie";
import { Data } from "@/types/data";
import MediaUpload from "@/features/media/components/upload";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";

const profileSchema = z.object({
  username: z.string().min(2, "Username must be at least 2 characters").max(30),
  email: z.string().email("Invalid email address"),
  bio: z.string().max(160).optional(),
  website: z.string().url().optional().or(z.literal("")),
  first_name: z.string().min(1, "First name is required").max(50),
  last_name: z.string().min(1, "Last name is required").max(50),
  avatar: z.string().optional(),
  mobile: z.string().max(15).optional(),
  countryCode: z.string().optional(), // Add separate country code field
});

type ProfileFormValues = z.infer<typeof profileSchema>;

// Common country codes for the select dropdown
const countryCodes = [
  { code: "+1", name: "United States" },
  { code: "+44", name: "United Kingdom" },
  { code: "+91", name: "India" },
  { code: "+61", name: "Australia" },
  { code: "+33", name: "France" },
  { code: "+49", name: "Germany" },
  { code: "+81", name: "Japan" },
  { code: "+86", name: "China" },
  { code: "+55", name: "Brazil" },
  { code: "+39", name: "Italy" },
];

export default function BasicProfileForm() {
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      username: "",
      email: "",
      bio: "",
      website: "",
      avatar: "",
      first_name: "",
      last_name: "",
      mobile: "",
      countryCode: "+1", // Separate field for country code
    },
  });

  // Fetch profile data on component mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // First try to get from cookie
        const userCookie = cookieService.getCookie("user");
        if (userCookie) {
          const userData = JSON.parse(userCookie);
          form.reset({
            username: userData.username || "",
            email: userData.email || "",
            bio: userData.bio || "",
            website: userData.website || "",
            avatar: userData.avatar || "",
            first_name: userData.first_name || userData.firstName || "",
            last_name: userData.last_name || userData.lastName || "",
            mobile: userData.mobile || "",
            countryCode: userData.countryCode || "+1",
          });
          return;
        }

        // If not in cookie, fetch from API
        const profileData = await profileService.getProfile();
        if (profileData) {
          form.reset({
            username: (profileData as any).username || "",
            email: (profileData as any).email || "",
            bio: (profileData as any).bio || "",
            website: (profileData as any).website || "",
            avatar: (profileData as any).avatar || "",
            first_name:
              (profileData as any).first_name ||
              (profileData as any).firstName ||
              "",
            last_name:
              (profileData as any).last_name ||
              (profileData as any).lastName ||
              "",
            mobile: (profileData as any).mobile || "",
            countryCode: (profileData as any).country_code || "+1",
          });
        }
      } catch (error) {
        console.error("Failed to fetch profile:", error);
        toast.error("Failed to load profile data");
      }
    };

    fetchProfile();
  }, [form]);

  async function onSubmit(data: ProfileFormValues) {
    try {
      // Prepare data for API call with separate fields
      const profileData: any = {
        first_name: data.first_name,
        last_name: data.last_name,
        country_code: data.countryCode,
        mobile: data.mobile,
        avatar: data.avatar,
      };

      console.log("Updating profile with data:", profileData);

      // Update profile via API
      const response = await profileService.updateProfile(profileData);

      // Update cookie with new data
      const userCookie = cookieService.getCookie("user");
      if (userCookie) {
        const userData = JSON.parse(userCookie);
        const updatedUserData = {
          ...userData,
          firstName: data.first_name,
          lastName: data.last_name,
          username: data.username,
          email: data.email,
          avatar: data.avatar,
          mobile: data.mobile,
          countryCode: data.countryCode,
        };
        cookieService.setCookie("user", JSON.stringify(updatedUserData));
      }

      toast.success("Profile updated successfully");
    } catch (error) {
      console.error("Failed to update profile:", error);
      toast.error("Failed to update profile");
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* First Name and Last Name in one row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="first_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>First Name</FormLabel>
                <FormControl>
                  <Input placeholder="John" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="last_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Last Name</FormLabel>
                <FormControl>
                  <Input placeholder="Doe" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="johndoe" {...field} />
              </FormControl>
              <FormDescription>
                This is your public display name
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="john@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Mobile Number with Country Code */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="countryCode"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Country Code</FormLabel>
                <Select
                  value={field.value || "+1"}
                  onValueChange={field.onChange}
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {countryCodes.map((country) => (
                      <SelectItem key={country.code} value={country.code}>
                        {country.code} ({country.name})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="mobile"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mobile Number</FormLabel>
                <FormControl>
                  <InputGroup>
                    <InputGroupAddon align="inline-start">
                      {form.watch("countryCode") || "+1"}
                    </InputGroupAddon>
                    <InputGroupInput
                      placeholder="Enter phone number"
                      {...field}
                    />
                  </InputGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="avatar"
          render={({ field }) => (
            <MediaUpload
              label="Avatar"
              value={field.value || ""}
              onChange={(url) => field.onChange(url)}
            />
          )}
        />

        <Button type="submit">Save Changes</Button>
      </form>
    </Form>
  );
}
