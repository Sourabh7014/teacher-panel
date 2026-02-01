"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { z } from "zod";
import locationService from "../../api.service";
import { toast } from "sonner";
import type { City, Country, State } from "../../model";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Common timezones
const TIMEZONES = [
  "America/New_York",
  "America/Chicago",
  "America/Denver",
  "America/Los_Angeles",
  "America/Anchorage",
  "America/Honolulu",
  "America/Phoenix",
  "America/Toronto",
  "America/Vancouver",
  "America/Mexico_City",
  "America/Sao_Paulo",
  "Europe/London",
  "Europe/Paris",
  "Europe/Berlin",
  "Europe/Rome",
  "Europe/Madrid",
  "Europe/Amsterdam",
  "Europe/Brussels",
  "Europe/Athens",
  "Europe/Moscow",
  "Asia/Jerusalem",
  "Asia/Dubai",
  "Asia/Kolkata",
  "Asia/Dhaka",
  "Asia/Bangkok",
  "Asia/Singapore",
  "Asia/Tokyo",
  "Asia/Seoul",
  "Asia/Shanghai",
  "Asia/Hong_Kong",
  "Australia/Sydney",
  "Australia/Melbourne",
  "Australia/Brisbane",
  "Australia/Perth",
  "Africa/Cairo",
  "Africa/Lagos",
  "Africa/Johannesburg",
];

const cityFormSchema = z.object({
  country: z.string().min(1, "Country is required"),
  state: z.string().min(1, "State is required"),
  name: z.string().min(1, "Name is required"),
  timezone: z.string().min(1, "Name is required"),
  supported: z.boolean(),
  active: z.boolean(),
});

type CityFormValues = z.infer<typeof cityFormSchema>;

interface CreateCityDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  city?: City | null; // Add city prop for editing
}

export function CreateCityDialog({
  open,
  onOpenChange,
  onSuccess,
  city = null,
}: CreateCityDialogProps) {
  const form = useForm<CityFormValues>({
    resolver: zodResolver(cityFormSchema),
    defaultValues: {
      country: "",
      state: "",
      name: "",
      timezone: "",
      supported: false,
      active: true,
    },
  });

  const [countries, setCountries] = useState<Country[]>([]);
  const [states, setStates] = useState<State[]>([]);
  const [allStates, setAllStates] = useState<State[]>([]); // Store all states
  const [loadingCountries, setLoadingCountries] = useState(true);
  const [loadingStates, setLoadingStates] = useState(true);

  // Fetch countries and all states once
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoadingCountries(true);
        setLoadingStates(true);

        // Fetch countries
        const countryResponse = await locationService.getCountries({
          per_page: 1000,
        });
        setCountries(countryResponse?.countries ?? []);

        // Fetch all states
        const stateResponse = await locationService.getStates({
          per_page: 10000,
        }); // Get all states
        setAllStates(stateResponse?.states ?? []);
        setStates(stateResponse?.states ?? []);
      } catch (error) {
        console.error("Failed to fetch data:", error);
        toast.error("Failed to load data");
      } finally {
        setLoadingCountries(false);
        setLoadingStates(false);
      }
    };

    if (open) {
      fetchData();
    }
  }, [open]);

  const countryId = form.watch("country");

  useEffect(() => {
    if (countryId) {
      const filteredStates = allStates.filter(
        (state) => state.country?.id === countryId
      );
      setStates(filteredStates);
    } else {
      setStates([]);
    }
  }, [countryId, allStates]);

  // Reset form when dialog opens or when city changes
  useEffect(() => {
    if (open) {
      // Set country first
      const countryValue = city?.country?.id || "";
      form.setValue("country", countryValue);

      // Set other fields
      form.setValue("name", city?.name || "");
      form.setValue("timezone", city?.timezone || "");
      form.setValue("supported", city?.supported || false);
      form.setValue("active", city?.active !== undefined ? city.active : true);

      // Set state after a brief delay to ensure country is set first
      if (city?.state?.id) {
        setTimeout(() => {
          form.setValue("state", city.state!.id);
        }, 100);
      }
    }
  }, [open, city, form]);

  const handleClose = () => {
    onOpenChange(false);
  };

  const onSubmit = async (data: CityFormValues) => {
    try {
      // Get the selected country and state
      const selectedCountry = countries.find((c) => c.id === data.country);
      const selectedState = states.find((s) => s.id === data.state);

      // Prepare data for submission - using the correct field names
      const submitData = {
        name: data.name,
        country_id: selectedCountry?.iso2 || data.country || "", // Ensure we always have a string
        state_id: selectedState?.code || data.state || "", // Ensure we always have a string
        timezone: data.timezone || undefined,
        supported: data.supported,
        active: data.active,
      };

      if (city) {
        // Edit mode
        const updatedCity = await locationService.updateCity(
          city.id,
          submitData
        );
        if (updatedCity) {
          toast.success("City updated successfully");
        } else {
          toast.error("Failed to update city");
        }
      } else {
        // Create mode
        const createdCity = await locationService.createCity(submitData);
        if (createdCity) {
          toast.success("City created successfully");
        } else {
          toast.error("Failed to create city");
        }
      }

      onSuccess();
      handleClose();
    } catch (error) {
      console.error(`Error ${city ? "updating" : "creating"} city:`, error);
      toast.error(`Failed to ${city ? "update" : "create"} city`);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{city ? "Edit City" : "Create City"}</DialogTitle>
          <DialogDescription>
            {city
              ? "Update city details. Click save when you're done."
              : "Add a new city to the system. Click save when you're done."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="country"
              render={({ field }) => (
                <FormItem className="col-span-full w-full">
                  <FormLabel>Country *</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    disabled={loadingCountries}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a country" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {countries.map((country) => (
                        <SelectItem key={country.id} value={country.id}>
                          {country.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {loadingCountries && <div>Loading countries...</div>}
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="state"
              render={({ field }) => (
                <FormItem className="col-span-full w-full">
                  <FormLabel>State *</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    disabled={loadingStates || !countryId}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a state" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {states.map((state) => (
                        <SelectItem key={state.id} value={state.id}>
                          {state.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {loadingStates && <div>Loading states...</div>}
                  {!countryId && <div>Please select a country first</div>}
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name *</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter city name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="timezone"
              render={({ field }) => (
                <FormItem className="col-span-full w-full">
                  <FormLabel>Timezone *</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value || undefined}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a timezone" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {TIMEZONES.map((tz) => (
                        <SelectItem key={tz} value={tz}>
                          {tz}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex space-x-4">
              <div className="flex-1">
                <FormField
                  control={form.control}
                  name="supported"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Supported</FormLabel>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex-1">
                <FormField
                  control={form.control}
                  name="active"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Active</FormLabel>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button type="submit">Save City</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
