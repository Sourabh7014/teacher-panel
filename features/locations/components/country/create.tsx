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
import { useEffect } from "react";
import { z } from "zod";
import locationService from "../../api.service";
import { toast } from "sonner";
import type { Country } from "../../model";

const countryFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  currency: z.string().optional().nullable(),
  country_code: z.string().min(1, "Country code is required"),
  iso2: z.string().min(1, "ISO2 is required"),
  iso3: z.string().optional().nullable(),
  supported: z.boolean(),
  active: z.boolean(),
});

type CountryFormValues = z.infer<typeof countryFormSchema>;

interface CreateCountryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  country?: Country | null; // Add country prop for editing
}

export function CreateCountryDialog({
  open,
  onOpenChange,
  onSuccess,
  country = null,
}: CreateCountryDialogProps) {
  const form = useForm<CountryFormValues>({
    resolver: zodResolver(countryFormSchema),
    defaultValues: {
      name: "",
      currency: null,
      country_code: "",
      iso2: "",
      iso3: null,
      supported: false,
      active: true,
    },
  });

  // Reset form when dialog opens or when country changes
  useEffect(() => {
    if (open) {
      form.reset({
        name: country?.name || "",
        currency: country?.currency || "",
        country_code: country?.country_code || "",
        iso2: country?.iso2 || "",
        iso3: country?.iso3 || "",
        supported: country?.supported || false,
        active: country?.active !== undefined ? country.active : true,
      });
    }
  }, [open, country, form]);

  const handleClose = () => {
    // Don't reset the country prop here, just close the dialog
    onOpenChange(false);
  };

  const onSubmit = async (data: CountryFormValues) => {
    try {
      // Clean up the data to remove null values for optional fields
      const cleanedData = {
        ...data,
        currency: data.currency || undefined,
        country_code: data.country_code || undefined,
        iso2: data.iso2 || undefined,
        iso3: data.iso3 || undefined,
      };

      if (country) {
        // Edit mode
        await locationService.updateCountry(country.id, cleanedData);
      } else {
        // Create mode
        await locationService.createCountry(cleanedData);
      }

      onSuccess();
      handleClose();
    } catch (error) {
      console.error("Error saving country:", error);
      toast.error(`Failed to ${country ? "update" : "create"} country`);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {country ? "Edit Country" : "Create Country"}
          </DialogTitle>
          <DialogDescription>
            {country
              ? "Update country details. Click save when you're done."
              : "Add a new country to the system. Click save when you're done."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name *</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter country name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="currency"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Currency</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter currency"
                      {...field}
                      value={field.value || ""}
                      onChange={(e) => field.onChange(e.target.value || null)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="country_code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Country Code *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter country code"
                      {...field}
                      value={field.value || ""}
                      onChange={(e) => field.onChange(e.target.value || null)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="iso2"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>ISO2 *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="ISO2 code"
                        {...field}
                        value={field.value || ""}
                        onChange={(e) => field.onChange(e.target.value || null)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="iso3"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>ISO3</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="ISO3 code"
                        {...field}
                        value={field.value || ""}
                        onChange={(e) => field.onChange(e.target.value || null)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

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
              <Button type="submit">Save Country</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
