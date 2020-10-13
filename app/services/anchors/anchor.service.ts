import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_URL } from '~/config';
import { Anchor } from '~/models/anchor';

@Injectable()
export class AnchorService {

  constructor(private httpClient: HttpClient) { }

  getAnchors() {
    let httpOptions = {
      headers: new HttpHeaders(
        {
          'Content-Type': 'application/json'
        })
    }
    return this.httpClient.get<Anchor[]>(API_URL + "/api/data/anchors", httpOptions)
  }


  getAnchorsFull() {
    let httpOptions = {
      headers: new HttpHeaders(
        {
          'Content-Type': 'application/json'
        })
    }
    return this.httpClient.get<Anchor[]>(API_URL + "/api/data/anchors/all", httpOptions)
  }

}
