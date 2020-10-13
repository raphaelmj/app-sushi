import { CartOrder } from '~/models/cart-order';
import { Injectable } from "@angular/core";
import { Subject } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class GetDataOrdersRefreshService {
  action$: Subject<{ bool: boolean, uuid: string, order: CartOrder }> = new Subject<{ bool: boolean, uuid, order: CartOrder }>();

  constructor() { }

  refresh(uuid: string, order: CartOrder) {
    this.action$.next({ bool: true, uuid, order });
  }
}
