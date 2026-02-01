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
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { z } from "zod";
import voucherService from "../api.service";
import { toast } from "sonner";
import type { Voucher } from "../model";
import { ScrollArea } from "@/components/ui/scroll-area";

const voucherFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  code: z.string().min(1, "Code is required"),
});

type VoucherFormValues = z.infer<typeof voucherFormSchema>;

interface CreateVoucherDialogProps {
  voucher?: Voucher;
  onConfirm: (data: VoucherFormValues | null) => void;
  vendorId: string;
}

export function CreateVoucherDialog({
  voucher,
  onConfirm,
  vendorId,
}: CreateVoucherDialogProps) {
  const [loading, setLoading] = useState(false);
  const form = useForm<VoucherFormValues>({
    resolver: zodResolver(voucherFormSchema),
    defaultValues: {
      name: "",
      code: "",
    },
  });

  // Reset form when dialog opens or when voucher changes
  useEffect(() => {
    if (voucher) {
      form.reset({
        name: voucher?.name || "",
        code: voucher?.code || "",
      });
    }
  }, [voucher, form]);

  const handleClose = () => {
    // Don't reset the country prop here, just close the dialog
    onConfirm(null);
  };

  const onSubmit = async (data: VoucherFormValues) => {
    try {
      setLoading(true);
      // Clean up the data to remove null values for optional fields
      const cleanedData = {
        ...data,
      };

      if (voucher) {
        // Edit mode
        await voucherService.update(voucher.id, cleanedData, vendorId);
      } else {
        // Create mode
        await voucherService.create(cleanedData, vendorId);
      }

      onConfirm(cleanedData);
      handleClose();
    } catch (error) {
      console.error("Error saving voucher:", error);
      toast.error(`Failed to ${voucher ? "update" : "create"} voucher`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form {...(form as any)}>
      <form
        onSubmit={(e) => form.handleSubmit(onSubmit)(e)}
        className="space-y-6 flex flex-col max-h-[calc(100vh-100px)]"
      >
        <DialogHeader>
          <DialogTitle>
            {voucher ? "Edit Voucher" : "Create Voucher"}
          </DialogTitle>
          <DialogDescription>
            {voucher
              ? "Update the details for this voucher."
              : "Fill in the details below to create a new voucher."}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 flex-1 overflow-hidden">
          <ScrollArea className="h-full">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-1">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name *</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter voucher name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Code *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter voucher code"
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
            {loading
              ? voucher
                ? "Saving..."
                : "Creating..."
              : voucher
              ? "Save Changes"
              : "Create Voucher"}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}
