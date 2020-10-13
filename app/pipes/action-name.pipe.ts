import { Pipe, PipeTransform } from '@angular/core';
import { OrderActionType, OrderActionTypeNames } from '~/models/cart-order';

@Pipe({
  name: 'actionName'
})
export class ActionNamePipe implements PipeTransform {

  types: Map<string, string> = new Map([
    [OrderActionType.onSite, OrderActionTypeNames.onSite],
    [OrderActionType.takeAway, OrderActionTypeNames.takeAway],
    [OrderActionType.delivery, OrderActionTypeNames.delivery]
  ])

  transform(value: OrderActionType, ...args: unknown[]): string {
    return this.types.get(value)
  }

}
