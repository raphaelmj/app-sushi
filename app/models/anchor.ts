import { SiteElement } from "./site";

export interface Anchor {
    id: number
    name: string
    alias: string
    site: number
    order: number
    sitesRange: number[]
    elements?: SiteElement[]
}