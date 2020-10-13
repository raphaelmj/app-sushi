import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RefreshOrdersService {

  action$: Subject<boolean> = new Subject()

  constructor() { }

  makeRefresh() {
    this.action$.next(true)
  }

}
