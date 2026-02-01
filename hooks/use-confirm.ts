import { useContext, useCallback } from "react";
import { ModalContext } from "@/components/modal-provider";
import {
  ConfirmDialog,
  ConfirmDialogOptions,
} from "@/components/ui/confirm-dialog";

export const useConfirm = () => {
  const modalContext = useContext(ModalContext);
  if (!modalContext) {
    throw new Error("useConfirm must be used within a ModalProvider");
  }

  const { openModal, closeModal } = modalContext;

  const confirm = useCallback(
    (options: ConfirmDialogOptions) => {
      return new Promise((resolve) => {
        const handleClose = (result: boolean) => {
          resolve(result);
          closeModal();
        };
        openModal(
          ConfirmDialog,
          { options, closeModal: handleClose },
          { size: "sm", showCloseButton: false }
        );
      });
    },
    [openModal, closeModal]
  );

  return confirm;
};
