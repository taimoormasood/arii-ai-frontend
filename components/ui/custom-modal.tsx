"use client";
import Image from "next/image";
import * as React from "react";

import { Button, ButtonProps } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface Action {
  text: string;
  onClick: () => void;
  variant?: ButtonProps["variant"];
}

export interface ModalProps {
  isOpen?: boolean;
  onClose?: () => void;
  title: string;
  subtitle?: string | React.ReactNode;
  des?: string;
  image?: {
    src: string;
    alt?: string;
  };
  actions?: Action[];
  children?: React.ReactNode;
}

export interface ModalHandler {
  openModal: (props: ModalProps) => void;
  hideModal: () => void;
}

const CustomModal = React.forwardRef<ModalHandler, {}>((_props, ref) => {
  const [isOpen, setIsOpen] = React.useState<boolean>(false);
  const [modalProps, setModalProps] = React.useState<ModalProps>();

  const {
    onClose,
    title,
    subtitle,
    des,
    image,
    actions = [],
    children,
  } = modalProps || {};

  React.useImperativeHandle(
    ref,
    () => ({
      openModal: (props: ModalProps) => {
        setIsOpen(true);
        setModalProps(props);
      },
      hideModal: () => {
        setIsOpen(false);
        setModalProps(undefined);
      },
    }),
    []
  );

  return (
    <Dialog
      open={isOpen}
      onOpenChange={() => {
        setIsOpen(false);
        setTimeout(() => {
          onClose?.();
        }, 100);
      }}
    >
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-semibold text-gray-800">
            {title}
          </DialogTitle>
          {subtitle && (
            <DialogDescription className="text-center text-gray-600 text-base">
              {subtitle}
            </DialogDescription>
          )}

          {image && (
            <div className="mx-auto mb-4 mt-4">
              <Image
                src={image.src}
                alt={image.alt || "Alert"}
                width={316}
                height={255}
                className="h-auto"
              />
            </div>
          )}
        </DialogHeader>

        <div className="py-4">{children}</div>

        {des && <p className="text-center text-gray-600 text-base">{des}</p>}

        {actions.length > 0 && (
          <div className="flex justify-center gap-4 mt-6">
            {actions.map((action, index) => (
              <Button
                key={index}
                variant={action.variant || "default"}
                onClick={() => {
                  setIsOpen(false);
                  setModalProps(undefined);
                  setTimeout(() => {
                    action?.onClick();
                  }, 100);
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
});

export { CustomModal };
