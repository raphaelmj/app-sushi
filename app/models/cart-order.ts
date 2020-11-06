import { CartElement } from "./cart-element";

export enum DatePosition {
    before = "before",
    now = "now",
    after = "after"
}

export enum OrderActionType {
    onSite = "onSite",
    takeAway = "takeAway",
    delivery = "delivery"
}

export enum OrderActionTypeNames {
    onSite = "Na miejscu",
    takeAway = "Na wynos",
    delivery = "Dostawa"
}

export enum OrderActionTypeShortNames {
    onSite = "L",
    takeAway = "W",
    delivery = "D"
}

export enum OrderStatusName {
    create = 'Nowe',
    ready = 'Gotowy',
    archive = 'Arch.'
}

export enum OrderStatus {
    create = 'create',
    ready = 'ready',
    archive = 'archive'
}

export enum BonusType {
    none = "none",
    cart = "cart",
    percent = "percent"
}

export interface CartOrder {
    id: number
    orderNumber: number
    endDay: any
    total: string
    bonusTotal: number
    bonusUsed: boolean
    bonusType: BonusType
    currentBonusPrice: number
    currentBonusPercent: number
    oneExtraPrice: number
    description: string | null
    forWho: string | null
    phone: string | null
    place: string
    status: OrderStatus
    inProgress: boolean
    actionType?: OrderActionType
    paid?: boolean
    reservation?: boolean
    reservationSize?: number
    onOnePlate?: boolean
    startAt: any | string | Date
    endAt: any | string | Date
    createdAt: any | string | Date
    cartOrderElements: CartElement[]
}
