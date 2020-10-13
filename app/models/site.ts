export enum ElementOptionType {
  none = "none",
  custom = "custom",
  select = "select",
  all = "all"
}

export enum ElementMenuType {
  manyNames = "many_names",
  oneName = "one_name",
  descElements = "desc_elements",
  configPrice = "config_price",
  configStepsPrice = "config_steps_price",
  configStepsPriceMany = "config_steps_price_many",
}

export interface ElementPrice {
  perSize: string;
  price: string;
  isSea: boolean;
}

export interface ElementDesc {
  info: string;
  shortName?: string
  price: string;
  seaPrice: string;
  isSea: boolean
  options: string[]
}

export interface ElementPriceName {
  name: string;
  shortName?: string
  desc: string;
  price: ElementPrice[];
  options: string[]
}

export interface SiteElement {
  _id: string;
  optionsOnInit: ElementOptionType,
  options: string[]
  elastic: boolean
  elementType: ElementMenuType;
  name: string;
  shortName?: string
  hasNamePrefix: boolean;
  description: string;
  perSizeForAll: string;
  image: string;
  priceNames: ElementPriceName[];
  descElements: ElementDesc[];
  price: ElementPrice[];
}

export interface Site {
  id: number;
  title: string;
  order: number;
  elements: SiteElement[];
}
