import { Subject } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RefreshAfterCronInprogressService {

  action$: Subject<{
    isChanged: boolean
  }> = new Subject<{ isChanged: boolean }>();

  constructor() { }

  emitRefresh(isChanged: boolean) {
    this.action$.next({ isChanged })
  }

}
