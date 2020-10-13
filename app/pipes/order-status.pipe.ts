import { Pipe, PipeTransform } from '@angular/core';
import { OrderStatusName, OrderStatus } from '~/models/cart-order';

@Pipe({
  name: 'orderStatus'
})
export class OrderStatusPipe implements PipeTransform {

  statuses: Map<string, string> = new Map([
    [OrderStatus.create, OrderStatusName.create],
    [OrderStatus.ready, OrderStatusName.ready,],
    [OrderStatus.archive, OrderStatusName.archive],
  ])

  transform(value: OrderStatus, ...args: unknown[]): unknown {
    return this.statuses.get(value)
  }

}
