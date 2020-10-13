import { MenuElement, ElementConfigStepsPrice } from '~/models/menu-element';
import { OrderActionType } from './cart-order';
import { SiteElement } from "./site";
import { Anchor } from "./anchor";
import { CartCategory } from "./cart-category";

export enum ElementType {
  manyNames = "many_names",
  oneName = "one_name",
  descElements = "desc_elements",
  configPrice = "config_price",
  configStepsPrice = "config_steps_price",
  configStepsPriceMany = "config_steps_price_many",
  special = "special"
}

export interface StepOptionsListElement {
  configFirstIndex: number
  configSecondIndex: number
  configThirdIndex: number
  pricePerOne?: number
}


export enum ServeType {
  plate = "plate",
  pack = "pack"
}

export interface AccType {
  name: string,
  icon: string
}

export interface AccElement {
  acc: AccType,
  howMany: number
}

export interface PlusElement {
  id?: number
  elementType: ElementType | string;
  ind?: { id: number; index: number | null, priceNameIndex: number | null, configFirstIndex: number | null, configSecondIndex: number | null, configThirdIndex: number | null };
  viewName?: string;
  shortName?: string;
  price: number;
  pricePerOne?: number
  qunatity?: number
  isSea?: boolean;
  canGrill?: boolean
  grill?: number
  hasGluten?: boolean
  gluten?: number
  optionsElements?: string[]
  reverseElements?: ReverseElement[];
  descElements?: string[];
  stepOptionsList?: StepOptionsListElement[] | null
  configStepsPrice?: ElementConfigStepsPrice[]
  description?: string;
}

export interface ReverseElement {
  from: string;
  to: string;
}

export interface ToCart {
  element: SiteElement;
  isSea: boolean;
  index: number | null;
  type?: Anchor;
}

export interface StepPriceIndex {
  index: number,
  option: number
}

export interface CartElement {
  id?: number;
  docId?: string;
  specialInd?: number
  ind?: { id: number; index: number | null, priceNameIndex: number | null, configFirstIndex: number | null, configSecondIndex: number | null, configThirdIndex: number | null };
  elementType: ElementType | string;
  elastic?: boolean;
  isSea: boolean;
  quantity: number;
  element?: MenuElement;
  optionsElements?: string[];
  descElements?: string[];
  plusElements: PlusElement[];
  reverseElements: ReverseElement[];
  stepOptionsList?: StepOptionsListElement[] | null
  viewName?: string;
  shortName?: string;
  price: number;
  pricePerOne?: number;
  description?: string;
  canExtra?: boolean
  extra?: number
  canGrill?: boolean
  onlyGrill?: boolean;
  grill?: number
  hasGluten?: boolean
  onlyGluten?: boolean;
  gluten?: number;
  canPack?: boolean
  type?: CartCategory;
  status?: boolean;
  serveType?: ServeType
  canAcc?: boolean
  acc?: AccElement[]
  onOnePlate?: boolean
  canOnePlate?: boolean
  cartCategory?: CartCategory
}

export interface CartGroup {
  type: CartCategory;
  elements: CartElement[];
}
