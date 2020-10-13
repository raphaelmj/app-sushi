import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { CartElement, CartGroup } from '~/models/cart-element';

@Injectable({
  providedIn: 'root'
})
export class CartSummaryUpdateService {

  action$: Subject<{ cart: CartElement[], cartEl: CartElement }> = new Subject<{ cart: CartElement[], cartEl: CartElement }>()

  constructor() { }

  update(cart: CartElement[], cartEl: CartElement) {
    this.action$.next({ cart, cartEl })
  }

}
