"use client";
import Image from "next/image";
import * as React from "react";

import { questionImage } from "@/assets/images";
import { Button, ButtonProps } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";

interface Action {
  text: string;
  onClick: () => void;
  variant?: ButtonProps["variant"];
}

export interface ModalProps {
  isOpen?: boolean;
  onClose?: () => void;
  actions?: Action[];
  children?: React.ReactNode;
  title?: string;
}

export function VendorConfirmationModal({
  isOpen,
  onClose,
  actions = [],
  children,
  title = "How would you like to invite vendors?",
}: ModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={() => onClose?.()}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <div className="mx-auto mt-4">
            <Image
              src={questionImage.src}
              alt={"Question Mark"}
              width={50}
              height={50}
              className="h-auto"
            />
          </div>
        </DialogHeader>

        {children && <div className="py-4">{children}</div>}

        {<p className="text-center text-gray-600 text-base">{title}</p>}

        {actions?.length > 0 && (
          <div className="flex justify-center gap-4 mt-6">
            {actions.map((action, index) => (
              <Button
                key={index}
                variant={action.variant || "default"}
                onClick={() => {
                  action?.onClick();
                  onClose?.();
                }}
              >
                {action.text}
              </Button>
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
