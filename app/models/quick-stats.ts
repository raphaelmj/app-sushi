export interface SumAndSize {
    total: number | null,
    size: number
}

export interface QuickStats {
    all: SumAndSize
    paid: SumAndSize
    notPaid: SumAndSize
    onSite: SumAndSize
    takeAway: SumAndSize
    onSiteNotPaid: SumAndSize
    takeAwayNotPaid: SumAndSize
}