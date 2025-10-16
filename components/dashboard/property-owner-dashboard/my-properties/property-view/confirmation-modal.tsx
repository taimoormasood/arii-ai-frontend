"use client";
import Image from "next/image";
import * as React from "react";

import { questionImage, trashImage } from "@/assets/images";
import { Button, ButtonProps } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";

interface Action {
  text: string;
  onClick: () => void;
  variant?: ButtonProps["variant"];
  isLoading?: boolean;
}

export interface ModalProps {
  isOpen?: boolean;
  onClose?: () => void;
  actions?: Action[];
  children?: React.ReactNode;
  title?: string;
  isDeleteMode?: boolean;
}

export function ConfirmationModal({
  isOpen,
  onClose,
  actions = [],
  children,
  title = "Do you want to add units now or skip and add later?",
  isDeleteMode = false,
}: ModalProps) {
  const icon = isDeleteMode ? trashImage : questionImage;

  return (
    <Dialog open={isOpen} onOpenChange={() => onClose?.()}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <div className="mx-auto mt-4">
            <Image
              src={icon.src}
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
                disabled={action.isLoading}
                onClick={() => {
                  action?.onClick();
                  // onClose?.();
                }}
              >
                {action.isLoading ? "Submitting..." : action.text}
              </Button>
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
