import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SiteElement } from '~/models/site';
import { API_URL } from '~/config';

@Injectable({
  providedIn: 'root'
})
export class SiteService {

  constructor(private httpClient: HttpClient) { }

  getAnchorSiteElements(anchorId: number): Observable<SiteElement[]> {
    let httpOptions = {
      headers: new HttpHeaders(
        {
          'Content-Type': 'application/json'
        })
    }
    return this.httpClient.get<SiteElement[]>(API_URL + "/api/data/anchor/" + anchorId + "/elements")
  }

}
