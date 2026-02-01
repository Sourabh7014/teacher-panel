"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import vendorService from "../api.service";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Coffee, Loader2 } from "lucide-react";
import { useEffect } from "react";
import { Switch } from "@/components/ui/switch";
import { AddressAutocomplete, FormattedAddress } from "./address";
import { toast } from "sonner";
import { Toggle } from "@/components/ui/toggle";
import { defaultValues, vendorFormSchema, VendorFormValues } from "../schema";
import { useState } from "react";
import { Amenity } from "@/features/amenities/model";
import amenityService from "@/features/amenities/api.service";
import OperatingHours from "./hours";
import MediaUpload from "../../media/components/upload";
import { Skeleton } from "@/components/ui/skeleton";

export default function CreateVendor() {
  const [amenities, setAmenities] = useState<Amenity[]>([]);
  const [amenitiesLoading, setAmenitiesLoading] = useState(false);

  const router = useRouter();

  const form = useForm<VendorFormValues>({
    resolver: zodResolver(vendorFormSchema) as any,
    defaultValues: defaultValues,
  });

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

  const {
    formState: { isSubmitting },
  } = form;

  const onSubmit: SubmitHandler<VendorFormValues> = async (data) => {
    try {
      const payload = {
        ...data,
        operation_hours: data.operation_hours.map((hour) => {
          if (hour.close) {
            return {
              day_of_week: hour.day_of_week,
              close: true,
            };
          }
          return {
            day_of_week: hour.day_of_week,
            close: false,
            from: hour.from,
            to: hour.to,
          };
        }),
      };

      // i want to remove null values from address
      if (payload.address.postal_code) {
        payload.address.postal_code = payload.address.postal_code;
      } else {
        delete payload.address.postal_code;
      }
      if (payload.address.city) {
        payload.address.city = payload.address.city;
      } else {
        delete payload.address.city;
      }
      if (payload.address.state) {
        payload.address.state = payload.address.state;
      } else {
        delete payload.address.state;
      }
      if (payload.address.country) {
        payload.address.country = payload.address.country;
      } else {
        delete payload.address.country;
      }
      if (payload.address.address_line_1) {
        payload.address.address_line_1 = payload.address.address_line_1;
      } else {
        delete payload.address.address_line_1;
      }
      if (payload.address.address_line_2) {
        payload.address.address_line_2 = payload.address.address_line_2;
      } else {
        delete payload.address.address_line_2;
      }

      await vendorService.create(payload);
      toast.success("Vendor created successfully!");
      router.push("/vendors");
    } catch (error) {
      console.error("Failed to create vendor", error);
      toast.error("Failed to create vendor. Please try again.");
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4 sm:space-y-6"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5">
          <div className="w-full">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl">
                  Basic Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
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

                <div className="grid gap-4 sm:grid-cols-2">
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

                <div className="grid gap-4 sm:grid-cols-2">
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
                          onAddressSelect={(
                            address: FormattedAddress | null
                          ) => {
                            if (address) {
                              // Ensure place_id exists before setting the value
                              if (!address.place_id) {
                                console.error(
                                  "Address is missing required field: place_id"
                                );
                                return;
                              }
                              form.setValue(
                                "address",
                                {
                                  ...address,
                                  place_id: address.place_id, // This is now guaranteed to be defined
                                },
                                {
                                  shouldValidate: true,
                                }
                              );
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
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 sm:p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-sm sm:text-base">
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
                        <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 gap-2">
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
                                    : currentValue.filter(
                                        (v) => v !== option.id
                                      );
                                  field.onChange(newValue);
                                }}
                                className="justify-start data-[state=on]:border-primary data-[state=on]:bg-primary/10 h-10 sm:h-12"
                              >
                                <div className="rounded-full bg-primary/10 p-1.5 sm:p-2">
                                  <Coffee className="h-3 w-3 sm:h-4 sm:w-4 text-primary" />
                                </div>
                                <span className="font-medium text-xs sm:text-sm truncate ml-1 sm:ml-2">
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
              </CardContent>
            </Card>
          </div>

          <div className="w-full">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl">
                  Operating Hours
                </CardTitle>
              </CardHeader>
              <CardContent>
                <OperatingHours />
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 sm:gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={isSubmitting}
            className="w-full sm:w-auto"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full sm:w-auto btn-primary-gradient"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              "Create Vendor"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
