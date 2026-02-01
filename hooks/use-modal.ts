import { useContext } from "react";
import { ModalContext } from "@/components/modal-provider";

/**
 * A custom hook to access the modal context for opening and closing modals.
 * @returns The modal context with `openModal` and `closeModal` functions.
 * @throws An error if used outside of a `ModalProvider`.
 */
export const useModal = () => {
  const context = useContext(ModalContext);
  if (context === undefined) {
    throw new Error("useModal must be used within a ModalProvider");
  }
  return context;
};
