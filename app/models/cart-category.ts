import { MenuElement } from "./menu-element";

export interface CartCategory {
  id: number;
  name: string;
  alias: string;
  bgColor?: string
  isSpecial?: boolean
  toPlus?: boolean
  ordering: number;
  elements?: MenuElement[];
}
