import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { ToCart } from '~/models/cart-element';

@Injectable()
export class AddToCartService {

  action$: Subject<ToCart> = new Subject<ToCart>()

  constructor() { }

  putToCart(toCart: ToCart) {
    this.action$.next(toCart)
  }

}
