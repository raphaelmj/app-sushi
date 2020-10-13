import { Subject } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RefreshAfterDeleteOrderService {

  action$: Subject<{
    uuid: string
  }> = new Subject<{ uuid: string }>();

  constructor() { }

  updateAfterDelete(uuid: string) {
    this.action$.next({ uuid });
  }

}
