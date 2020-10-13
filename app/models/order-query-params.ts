export interface OrderQueryParams {
    page: string | number
    sts: string
    day?: string
    paid?: 'all' | '0' | '1' | 'none'
    reservation?: '0' | '1' | 'all'
    inprogress?: '0' | '1' | 'all'
}