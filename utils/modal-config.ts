"use client";
import { createRef } from "react";

import { ModalHandler, ModalProps } from "@/components/ui/custom-modal";

export const customModalRef = createRef<ModalHandler>();

export const showModal = async (props: ModalProps) => {
  customModalRef.current?.openModal(props);
};
export const hideModal = () => customModalRef.current?.hideModal();
