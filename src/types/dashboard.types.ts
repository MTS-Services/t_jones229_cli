import { JSX, ReactNode } from "react";

export type TSidebarItem = {
  key: string;
  icon: JSX.Element;
  label: ReactNode;
  roles: string[];
};
export type BoatSidebarItem = {
  key: string;
  icon: JSX.Element;
  label: ReactNode;
  activePath?: string[];
};
