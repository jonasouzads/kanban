// components/ConfirmationDialog.tsx

import React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FiAlertTriangle } from "react-icons/fi";

type ConfirmationDialogProps = {
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  isOpen: boolean;
};

const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  message,
  onConfirm,
  onCancel,
  isOpen,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onCancel()}>
      <DialogContent className="max-w-md mx-auto p-6 space-y-6 text-center">
        <DialogHeader className="flex flex-col items-center">
          <FiAlertTriangle size={32} className="text-red-500 mb-2" />
          <DialogTitle className="text-xl font-semibold text-gray-800">
            Confirmação
          </DialogTitle>
        </DialogHeader>
        <p className="text-gray-600 text-base">{message}</p>
        <DialogFooter className="flex justify-center gap-4 pt-4">
          <Button variant="destructive" onClick={onConfirm} className="px-6">
            Sim
          </Button>
          <Button variant="secondary" onClick={onCancel} className="px-6">
            Não
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ConfirmationDialog;
