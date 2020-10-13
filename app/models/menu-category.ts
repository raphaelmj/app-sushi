import { MenuElement } from "./menu-element";
export interface MenuCategory {
  id: number;
  name: string;
  alias: string;
  fullName?: string
  bgColor?: string
  fontColor?: string
  ordering: number;
  elements?: MenuElement[];
}
