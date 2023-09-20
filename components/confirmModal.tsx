import React, { ReactNode } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import cx from "classnames";

type ConfirmModalType = {
  title: string;
  contentText: string;
  openBtn: ReactNode;
  open?: boolean;
  icon?: ReactNode;
  showOpenBtn?: boolean;
  handleCancel?: () => void;
  handleConfirm?: () => void;
  variant: "confirm" | "delete" | "warning";
};
function ConfirmModal({
  openBtn,
  title,
  contentText,
  variant,
  open,
  icon,
  showOpenBtn = true,
  handleConfirm,
  handleCancel,
}: ConfirmModalType) {
  return (
    <AlertDialog open={open}>
      {showOpenBtn && (
        <AlertDialogTrigger asChild>{openBtn}</AlertDialogTrigger>
      )}
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <div>{icon}</div>
            <p>{title}</p>
          </AlertDialogTitle>
          <AlertDialogDescription>{contentText}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={handleCancel}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            className={cx({
              "bg-red-700 hover:bg-red-600": variant === "delete",
              "bg-cyan-700 hover:bg-cyan-600": variant === "confirm",
            })}
          >
            {variant === "delete" ? "Delete" : "Confirm"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default ConfirmModal;
