import { PlusElement, ReverseElement, ServeType, StepOptionsListElement } from "./cart-element";

export interface FullOptionsGroup {
    descElements?: string[]
    plusElements: PlusElement[]
    reverseElements: ReverseElement[],
    optionsElements?: string[]
    stepOptionsList?: StepOptionsListElement[]
    description: string
    quantity?: number,
    isSea?: boolean
    grill?: number
    gluten?: number,
    index?: number | null
    priceNameIndex?: number | null
    configFirstIndex?: null | number
    configSecondIndex?: null | number
    configThirdIndex?: null | number
    serveType?: ServeType
    onOnePlate?: boolean
    acc?: Array<{ acc: { name: string, icon: string }, howMany: number }>
    extra?: number

}