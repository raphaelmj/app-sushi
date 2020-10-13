import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DescOptions } from '~/models/desc-options';
import { ReverseOptions } from '~/models/reverse-options';
import { API_URL } from '~/config';

@Injectable({
  providedIn: 'root'
})
export class OptionService {

  constructor(private httpClient: HttpClient) { }


  getOptions(): Observable<{ desc: DescOptions[], reverse: ReverseOptions[] }> {
    return this.httpClient.get<{ desc: DescOptions[], reverse: ReverseOptions[] }>(API_URL + "/api/data/options")
  }


}
