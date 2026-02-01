"use client";

import { Button } from "@/components/ui/button";
import {
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
import { ScrollArea } from "@/components/ui/scroll-area";
import { useEffect, useState } from "react";
import vendorService from "../api.service";
import { Vendor } from "../model";
import { vendorEditSchema, VendorEditValues } from "../schema";
import { Amenity } from "@/features/amenities/model";
import amenityService from "@/features/amenities/api.service";
import MediaUpload from "@/features/media/components/upload";
import { AddressAutocomplete, FormattedAddress } from "./address";
import { Skeleton } from "@/components/ui/skeleton";
import { Toggle } from "@/components/ui/toggle";
import { Coffee } from "lucide-react";

export default function EditVendor({
  vendor,
  onConfirm,
}: {
  vendor: Vendor;
  onConfirm: (data: Vendor | null) => void;
}) {
  const [loading, setLoading] = useState(false);
  const [amenities, setAmenities] = useState<Amenity[]>([]);
  const [amenitiesLoading, setAmenitiesLoading] = useState(false);

  const form = useForm<VendorEditValues>({
    resolver: zodResolver(vendorEditSchema) as any,
    defaultValues: {
      name: vendor.name,
      mobile: vendor.mobile,
      website: vendor.website,
      logo: vendor.logo,
      banner: vendor.banner,
      radius: vendor.radius,
      serves_breakfast: !!vendor.serves_breakfast,
      address: vendor.address,
      amenities: vendor.amenities?.map((amenity) => amenity.id) || [],
    },
  });

  // call api to get all amenities
  useEffect(() => {
    const fetchAmenities = async () => {
      try {
        setAmenitiesLoading(true);
        const response = await amenityService.list();
        if (response?.amenities) {
          setAmenities(response.amenities);
        }
      } catch (error) {
        console.error("Failed to fetch amenities", error);
      } finally {
        setAmenitiesLoading(false);
      }
    };
    fetchAmenities();
  }, []);

  async function onSubmit(values: VendorEditValues) {
    try {
      setLoading(true);
      const response = await vendorService.update(vendor.id, values);
      if (response?.vendor) {
        onConfirm(response.vendor);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <Form {...(form as any)}>
      <form
        onSubmit={(e) => form.handleSubmit(onSubmit)(e)}
        className="space-y-6 flex flex-col max-h-[calc(100vh-100px)]"
      >
        <DialogHeader>
          <DialogTitle>Edit Vendor</DialogTitle>
          <DialogDescription>
            Update the details for this vendor.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 flex-1 overflow-hidden">
          <ScrollArea className="h-full">
            <div className="space-y-4 px-1">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Business Name *</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter business name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="website"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Website</FormLabel>
                      <FormControl>
                        <Input placeholder="https://example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="mobile"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contact Number</FormLabel>
                      <FormControl>
                        <Input placeholder="+1 (555) 123-4567" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="logo"
                  render={({ field }) => (
                    <MediaUpload
                      label="Logo"
                      value={field.value}
                      onChange={(url) => field.onChange(url)}
                    />
                  )}
                />
                <FormField
                  control={form.control}
                  name="banner"
                  render={({ field }) => (
                    <MediaUpload
                      label="Banner"
                      value={field.value}
                      onChange={(url) => field.onChange(url)}
                    />
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <AddressAutocomplete
                        onAddressSelect={(address: FormattedAddress | null) => {
                          if (address) {
                            form.setValue("address", address, {
                              shouldValidate: true,
                            });
                          }
                        }}
                        defaultValue={field.value?.address}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="radius"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Coverage Radius (in Meters)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Radius in meters"
                        {...field}
                        value={field.value ?? ""}
                        onChange={(e) => {
                          const value = e.target.value;
                          if (value === "") {
                            field.onChange(null);
                          } else if (!isNaN(Number(value))) {
                            field.onChange(Number(value));
                          }
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="serves_breakfast"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">
                        Serves Breakfast or Brunch
                      </FormLabel>
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

              <FormField
                control={form.control}
                name="amenities"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Amenities</FormLabel>
                    <FormControl>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {amenitiesLoading ? (
                          <>
                            {Array.from({ length: 9 }).map((_, index) => (
                              <Skeleton key={index} className="h-10 w-full" />
                            ))}
                          </>
                        ) : (
                          amenities.map((option) => (
                            <Toggle
                              key={option.id}
                              variant="outline"
                              pressed={field.value?.includes(option.id)}
                              onPressedChange={(pressed) => {
                                const currentValue = field.value || [];
                                const newValue = pressed
                                  ? [...currentValue, option.id]
                                  : currentValue.filter((v) => v !== option.id);
                                field.onChange(newValue);
                              }}
                              className="justify-start data-[state=on]:border-primary data-[state=on]:bg-primary/10 h-12"
                            >
                              <div className="rounded-full bg-primary/10 p-1.5 sm:p-2">
                                <Coffee className="h-3 w-3 sm:h-4 sm:w-4 text-primary" />
                              </div>
                              <span className="font-medium text-xs sm:text-sm truncate">
                                {option.name}
                              </span>
                            </Toggle>
                          ))
                        )}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </ScrollArea>
        </div>

        <DialogFooter className="mt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => onConfirm(null)}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="btn-primary-gradient"
            disabled={loading}
          >
            {loading ? "Saving..." : "Save Changes"}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}
