import { OrderService } from '~/services/orders/order.service';
import { CartOrder } from '~/models/cart-order';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import * as moment from "moment";

@Injectable({
  providedIn: 'root'
})
export class DayReservationsResolveService implements Resolve<{ dayR: CartOrder[], soonR: CartOrder[], day: string }> {

  constructor(private orderService: OrderService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): { dayR: CartOrder[]; soonR: CartOrder[]; day: string; } | Observable<{ dayR: CartOrder[]; soonR: CartOrder[]; day: string; }> | Promise<{ dayR: CartOrder[]; soonR: CartOrder[]; day: string; }> {
    let day: string = (route.queryParams['day']) ? route.queryParams['day'] : moment(new Date()).format("yy-MM-DD");
    return this.orderService.getDayReservations(day)
  }
}
