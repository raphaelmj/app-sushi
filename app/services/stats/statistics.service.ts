import { DayStats } from './../../models/es-day-stats';
import { Observable } from 'rxjs';
import { API_URL } from '~/config';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StatisticsService {

  constructor(private httpClient: HttpClient) { }

  dayElements(day: string): Observable<DayStats> {
    return this.httpClient.get<DayStats>(API_URL + '/es/api/search/day/stats?day=' + day)
  }

}
