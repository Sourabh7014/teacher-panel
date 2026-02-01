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
import type { State, Country } from "../../model";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const stateFormSchema = z.object({
  country_id: z.string().min(1, "Country is required"),
  name: z.string().min(1, "Name is required"),
  code: z.string().min(1, "Code is required"),
  state_code: z.string().optional().nullable(),
  supported: z.boolean(),
  active: z.boolean(),
});

type StateFormValues = z.infer<typeof stateFormSchema>;

interface CreateStateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  state?: State | null; // Add state prop for editing
}

export function CreateStateDialog({
  open,
  onOpenChange,
  onSuccess,
  state = null,
}: CreateStateDialogProps) {
  const form = useForm<StateFormValues>({
    resolver: zodResolver(stateFormSchema),
    defaultValues: {
      country_id: "",
      name: "",
      code: "",
      state_code: null,
      supported: false,
      active: true,
    },
  });

  const [countries, setCountries] = useState<Country[]>([]);

  // Fetch countries for the dropdown
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await locationService.getCountries();
        setCountries(response?.countries ?? []);
      } catch (error) {
        console.error("Failed to fetch countries:", error);
        toast.error("Failed to load countries");
      }
    };

    if (open) {
      fetchCountries();
    }
  }, [open]);

  // Reset form when dialog opens or when state changes
  useEffect(() => {
    if (open) {
      form.reset({
        country_id: state?.country?.id || "",
        name: state?.name || "",
        code: state?.code || "",
        state_code: state?.state_code || null,
        supported: state?.supported || false,
        active: state?.active !== undefined ? state.active : true,
      });
    }
  }, [open, state, form]);

  const handleClose = () => {
    onOpenChange(false);
  };

  const onSubmit = async (data: StateFormValues) => {
    try {
      // Find the selected country to get its ISO2
      const selectedCountry = countries.find((c) => c.id === data.country_id);

      // Clean up the data to remove null values for optional fields
      const cleanedData = {
        ...data,
        country_id: selectedCountry?.iso2 || data.country_id, // Send ISO2 instead of ID
        code: data.code || undefined,
        state_code: data.state_code || undefined,
      };

      if (state) {
        // Edit mode
        const updatedState = await locationService.updateState(
          state.id,
          cleanedData
        );
        if (updatedState) {
          toast.success("State updated successfully");
        } else {
          toast.error("Failed to update state");
        }
      } else {
        // Create mode
        // Extend LocationService to include createState method
        const createdState = await locationService.createState(cleanedData);
        if (createdState) {
          toast.success("State created successfully");
        } else {
          toast.error("Failed to create state");
        }
      }

      onSuccess();
      handleClose();
    } catch (error) {
      console.error("Error saving state:", error);
      toast.error(`Failed to ${state ? "update" : "create"} state`);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{state ? "Edit State" : "Create State"}</DialogTitle>
          <DialogDescription>
            {state
              ? "Update state details. Click save when you're done."
              : "Add a new state to the system. Click save when you're done."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="grid grid-cols-1 gap-4"
          >
            <FormField
              control={form.control}
              name="country_id"
              render={({ field }) => (
                <FormItem className="col-span-full w-full">
                  <FormLabel>Country *</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full" disabled={!!state}>
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
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="col-span-full w-full">
                  <FormLabel>Name *</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter state name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem className="col-span-full">
                  <FormLabel>Code *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter code"
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
              name="state_code"
              render={({ field }) => (
                <FormItem className="col-span-full">
                  <FormLabel>State Code</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter state code"
                      {...field}
                      value={field.value || ""}
                      onChange={(e) => field.onChange(e.target.value || null)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="col-span-full">
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
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button type="submit">Save State</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
