import { BucketPlusElement } from './../../models/es-index-response';
import { Observable } from 'rxjs';
import { API_URL } from '~/config';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StatisticsService {

  constructor(private httpClient: HttpClient) { }

  dayElements(day: string): Observable<{ list: BucketPlusElement[], total: number, day: string, priceTotal: number, priceExtra: number, bonusPriceTotal: number }> {
    return this.httpClient.get<{ list: BucketPlusElement[], total: number, day: string, priceTotal: number, priceExtra: number, bonusPriceTotal: number }>(API_URL + '/es/api/search/day/elements?day=' + day)
  }

}
