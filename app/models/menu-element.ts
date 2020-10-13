import { ElementPrice, ElementMenuType } from "~/models/site";
import { ElementPriceName } from "./site";
import { ElementOptionType, ElementDesc } from "~/models/site";
import { CartCategory } from "./cart-category";

export interface PriceTypeOption {
  name: string
  shortName: string
  price: string,
  isSea: boolean
}

export interface ElementConfigStepsPriceType {
  type: string,
  options: PriceTypeOption[]
}

export interface ElementConfigStepsPrice {
  name: string
  shortName: string
  types: ElementConfigStepsPriceType[]
}

export interface MenuElement {
  id: number;
  _id: string;
  optionsOnInit: ElementOptionType;
  options: string[];
  elastic: boolean;
  elementType: ElementMenuType;
  name: string;
  shortName?: string;
  hasNamePrefix: boolean;
  description: string;
  perSizeForAll: string;
  image: string;
  priceNames: ElementPriceName[];
  descElements: ElementDesc[];
  configStepsPrice: ElementConfigStepsPrice[]
  skipStepOne?: boolean
  price: ElementPrice[];
  hasGluten?: boolean;
  onlyGluten?: boolean;
  canGrill?: boolean;
  onlyGrill?: boolean;
  canExtra?: boolean
  canPack?: boolean
  cartCategory?: CartCategory;
  canOnePlate?: boolean
  canAcc?: boolean
}
