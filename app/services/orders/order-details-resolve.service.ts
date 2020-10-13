import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { CartOrder } from '~/models/cart-order';
import { Observable } from 'rxjs';
import { OrderService } from './order.service';
import { CartGroup } from '~/models/cart-element';

@Injectable({
  providedIn: 'root'
})
export class OrderDetailsResolveService implements Resolve<{ order: CartOrder, group: CartGroup[] }> {

  constructor(private orderService: OrderService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<{ order: CartOrder, group: CartGroup[] }> {
    let id: string = route.params['id']
    return this.orderService.getOrder(id)
  }


}
