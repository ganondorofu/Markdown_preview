"use client";

import type { Dispatch, SetStateAction } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle } from 'lucide-react';

interface PopupDialogProps {
  isOpen: boolean;
  onOpenChange: Dispatch<SetStateAction<boolean>>;
}

export function PopupDialog({ isOpen, onOpenChange }: PopupDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-popover text-popover-foreground border-border shadow-xl">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <CheckCircle className="mr-2 h-5 w-5 text-primary" />
            Popup Pro Message
          </DialogTitle>
          <DialogDescription className="text-muted-foreground pt-1">
            You have successfully triggered a popup message from the activity bar.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 text-sm">
          <p>This dialog demonstrates the popup functionality within the VSCode-like interface.</p>
        </div>
        <DialogFooter>
          <Button variant="default" onClick={() => onOpenChange(false)}>
            Got it!
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
