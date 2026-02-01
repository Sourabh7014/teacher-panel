import { useState } from "react";
import {
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { BsQuestion } from "react-icons/bs";

export interface ConfirmDialogOptions {
  title: string;
  variant?: "destructive" | "success";
  description?: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
}

export const ConfirmDialog = ({
  options,
  closeModal,
}: {
  options: ConfirmDialogOptions;
  closeModal: (result: boolean) => void;
}) => {
  const [isLoading, setIsLoading] = useState(false);

  // Handle confirmation action
  const handleConfirm = async () => {
    if (options.onConfirm) {
      setIsLoading(true);
      try {
        await options.onConfirm();
        closeModal(true);
      } catch (error) {
        console.error("Confirmation API call failed:", error);
        closeModal(false);
      } finally {
        setIsLoading(false);
      }
    } else {
      closeModal(true);
    }
  };

  // Handle cancel action
  const handleCancel = () => {
    closeModal(false);
  };

  return (
    <>
      <DialogHeader>
        <div
          className={`mx-auto mb-2 w-16 h-16 ${
            options.variant === "success" ? "bg-green-100" : "bg-red-100"
          } rounded-full flex items-center justify-center`}
        >
          <BsQuestion
            className={`h-10 w-10 ${
              options.variant === "success" ? "text-green-600" : "text-red-600"
            }`}
          />
        </div>
        <DialogTitle className="text-xl text-center font-semibold">
          {options.title}
        </DialogTitle>
        <DialogDescription className="text-center">
          {options.description}
        </DialogDescription>
      </DialogHeader>

      <DialogFooter className="flex gap-5 sm:justify-center">
        <Button
          variant="outline"
          onClick={handleCancel}
          disabled={isLoading}
          className={`min-w-[120px] ${
            options.variant === "success"
              ? "border-green-500 text-green-500 hover:bg-green-500/90 hover:text-white"
              : "border-red-500 text-red-500 hover:bg-red-500/90 hover:text-white"
          }`}
        >
          {options.cancelText || "Cancel"}
        </Button>
        <Button
          onClick={handleConfirm}
          disabled={isLoading}
          className={`min-w-[120px] ${
            options.variant === "success"
              ? "bg-green-500 text-white hover:bg-green-500/90"
              : "bg-red-500 text-white hover:bg-red-500/90"
          }`}
        >
          {isLoading && (
            <svg
              className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          )}
          {options.confirmText || "Confirm"}
        </Button>
      </DialogFooter>
    </>
  );
};
