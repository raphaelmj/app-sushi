import { API_URL } from './../config';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppConfig } from '~/models/app-config';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private httpClient: HttpClient) { }

  getAppConfig(): Observable<AppConfig> {
    return this.httpClient.get<AppConfig>(API_URL + '/api/data/app/config')
  }

}
