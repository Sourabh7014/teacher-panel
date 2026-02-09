"use client";

import BasicProfile from "@/features/profile/components/basic";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import ProfileLockedScreen from "@/features/profile/components/ProfileLockedScreen";
import { load, CheckoutOptions } from "@cashfreepayments/cashfree-js";
import { PaymentSession } from "@/features/profile/model";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

export default function ProfilePage() {
  const { isPendingOrInactive, isActive, isLoading, refreshUser } = useAuth();

  const handlePayNow = async () => {
    console.log("🔵 Payment button clicked");
    try {
      console.log("🔵 Fetching payment session...");
      const response: PaymentSession | undefined =
        await import("@/features/profile/api.service").then((mod) =>
          mod.default.initiatePayment(),
        );

      console.log("🔵 Payment session received:", response);

      const cashfree = await load({
        mode: "sandbox",
      });

      console.log("🔵 Cashfree SDK loaded");

      // Start polling for payment status
      let pollInterval: NodeJS.Timeout | null = null;
      let pollCount = 0;
      const maxPolls = 60; // Poll for max 3 minutes (60 * 3 seconds)

      const startPolling = async () => {
        console.log("🔵 Starting payment status polling...");

        pollInterval = setInterval(async () => {
          pollCount++;
          console.log(`🔵 Polling attempt ${pollCount}/${maxPolls}...`);

          try {
            const profileService =
              await import("@/features/profile/api.service").then(
                (mod) => mod.default,
              );

            const statusResponse =
              (await profileService.verifyPaymentStatus()) as any;
            console.log("🔵 Poll response:", statusResponse);

            // Check if payment was successful
            if (statusResponse?.payment_status === "paid") {
              console.log("✅ Payment successful detected!");
              toast.success("Payment successful! Refreshing your profile...");

              // Stop polling
              if (pollInterval) {
                clearInterval(pollInterval);
                pollInterval = null;
              }

              // Refresh user data
              await refreshUser();
            } else if (statusResponse?.payment_status === "failed") {
              console.log("❌ Payment failed detected");
              toast.error("Payment failed. Please try again.");

              // Stop polling
              if (pollInterval) {
                clearInterval(pollInterval);
                pollInterval = null;
              }
            }

            // Stop polling after max attempts
            if (pollCount >= maxPolls) {
              console.log("⚠️ Polling timeout - max attempts reached");
              if (pollInterval) {
                clearInterval(pollInterval);
                pollInterval = null;
              }
              toast.info(
                "Payment verification timeout. Please refresh if status doesn't update.",
              );
            }
          } catch (error) {
            console.error("❌ Error during polling:", error);
          }
        }, 3000); // Poll every 3 seconds
      };

      // Using modal with polling approach
      const checkoutOptions: CheckoutOptions = {
        paymentSessionId: response?.payment_session_id || "",
        redirectTarget: "_modal",
        onClose: () => {
          console.log("🔴 Payment modal closed (manual or auto)");
          // Stop polling when modal closes
          if (pollInterval) {
            console.log("🔵 Stopping polling due to modal close");
            clearInterval(pollInterval);
            pollInterval = null;
          }
        },
      };

      console.log("🔵 Checkout options prepared");
      console.log("🔵 Opening Cashfree modal...");

      cashfree.checkout(checkoutOptions);

      console.log("🔵 Checkout called successfully");

      // Start polling after a short delay to let modal open
      setTimeout(() => {
        startPolling();
      }, 2000);
    } catch (error) {
      console.error("❌ Payment initiation failed", error);
      toast.error("Failed to initiate payment");
    }
  };

  // Show loading state while fetching user data
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {isPendingOrInactive ? (
        <ProfileLockedScreen onPayNow={handlePayNow} />
      ) : (
        <div>
          <div className="mb-5">
            <h1 className="text-2xl font-semibold text-foreground">Profile</h1>
            <p className="text-muted-foreground">
              Manage your profile information here.
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>
                Update your personal details and contact information.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <BasicProfile />
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
