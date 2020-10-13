import { Pipe, PipeTransform } from '@angular/core';
import { OrderActionType, OrderActionTypeShortNames } from '~/models/cart-order';

@Pipe({
  name: 'actionShortName'
})
export class ActionShortNamePipe implements PipeTransform {

  types: Map<string, string> = new Map([
    [OrderActionType.onSite, OrderActionTypeShortNames.onSite],
    [OrderActionType.takeAway, OrderActionTypeShortNames.takeAway],
    [OrderActionType.delivery, OrderActionTypeShortNames.delivery]
  ])

  transform(value: OrderActionType, ...args: unknown[]): unknown {
    return this.types.get(value)
  }

}
