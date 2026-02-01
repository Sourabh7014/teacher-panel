"use client";

import { Button } from "@/components/ui/button";
import {
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useEffect, useState } from "react";
import vendorService from "../api.service";
import { toast } from "sonner";

import { OperatingHourValues, operatingHourSchema } from "../schema";
import { OperationHour, Vendor } from "../model";
import OperatingHours from "./hours";
import { Skeleton } from "@/components/ui/skeleton";

export default function EditVendorHours({
  vendorId,
  hours,
  onConfirm,
}: {
  vendorId: string;
  hours?: OperationHour[];
  onConfirm: (data: Vendor | null) => void;
}) {
  const [loading, setLoading] = useState(false);
  const [isLoadingHours, setIsLoadingHours] = useState(!hours);

  const form = useForm<OperatingHourValues>({
    resolver: zodResolver(operatingHourSchema),
    defaultValues: {
      operation_hours: hours,
    },
    mode: "onChange",
  });

  useEffect(() => {
    const fetchHours = async () => {
      if (!hours && vendorId) {
        try {
          const response = await vendorService.hours(vendorId);
          if (response?.operation_hours) {
            form.reset({
              operation_hours: response.operation_hours,
            });
          }
        } catch (error) {
          console.error("Error fetching hours:", error);
          toast.error("Failed to load operating hours");
        } finally {
          setIsLoadingHours(false);
        }
      } else {
        setIsLoadingHours(false);
      }
    };

    fetchHours();
  }, [hours, vendorId, form]);

  async function onSubmit(values: OperatingHourValues) {
    try {
      setLoading(true);
      const response = await vendorService.update(vendorId, values);
      if (response?.vendor) {
        onConfirm(response.vendor);
      }
    } catch (error) {
      console.error("Error updating vendor:", error);
      // Add proper error handling here
    } finally {
      setLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
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
            {isLoadingHours ? (
              <div className="space-y-3 p-1">
                {[...Array(7)].map((_, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between gap-4 rounded-lg border bg-card p-4"
                  >
                    <div className="flex items-center gap-4">
                      <Skeleton className="h-5 w-10 rounded-full" />
                      <div>
                        <Skeleton className="h-4 w-24 mb-1" />
                        <Skeleton className="h-3 w-16" />
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-9 w-24" />
                      <Skeleton className="h-9 w-24" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <OperatingHours />
            )}
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
