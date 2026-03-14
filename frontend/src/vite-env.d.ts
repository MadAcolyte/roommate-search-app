/// <reference types="vite/client" />

declare module "reoverlay" {
  import type { ComponentType } from "react";
  export const ModalContainer: ComponentType;
  export const Reoverlay: {
    showModal(component: ComponentType, props?: object): void;
    hideModal(modalKey?: string): void;
    config(config: Array<{ name: string; component: ComponentType }>): void;
  };
  export const ModalWrapper: ComponentType;
}
