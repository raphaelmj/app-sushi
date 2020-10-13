import { ServeType } from '~/models/cart-element';
import { EsIndexElement } from './es-element';
export interface IndexResponseElementsHits {
    _index: string,
    _type: string,
    _id: string,
    _score: number,
    _source: EsIndexElement
}

export interface IndexResponseHits {
    total: {
        value: number,
        relation: string
    }
    max_score: number
    hits: IndexResponseElementsHits[]

}

export interface SumAggsValue {
    value: number
}

export interface AggsTypes {
    countElements?: DayElementsAggs
    priceTotal?: SumAggsValue
    priceExtra?: SumAggsValue
    bonusPriceTotal?: SumAggsValue
}

export interface BucketServeType {
    key: ServeType
    doc_count: number
}

export interface Bucket {
    key: any
    doc_count: number
    ids?: IdsElementsAggs
    serveTypes?: ServeTypesElementsAggs
}

export interface DayElementsAggs {
    doc_count_error_upper_bound: number
    sum_other_doc_count: number
    buckets: Bucket[]
}

export interface IdsElementsAggs {
    doc_count_error_upper_bound: number
    sum_other_doc_count: number
    buckets: Bucket[]
}

export interface ServeTypesElementsAggs {
    doc_count_error_upper_bound: number
    sum_other_doc_count: number
    buckets: BucketServeType[]
}

export interface IndexResponseBody {
    took: number
    timed_out: boolean
    _shards: {
        total: number,
        successful: number
        skipped: number
        failed: number
    }
    hits: IndexResponseHits
    aggregations?: AggsTypes
}
export interface IndexResponse {
    body: IndexResponseBody
}

export interface ServeTypesCount {
    pack: number,
    plate: number
}

export interface BucketPlusElement extends Bucket {
    element: string
    percent: number
    names: string[]
    mergeNames?: string,
    serveTypesCount: ServeTypesCount
}