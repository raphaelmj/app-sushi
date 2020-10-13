import { Pipe, PipeTransform } from '@angular/core';
import { CartElement, PlusElement } from '~/models/cart-element';

@Pipe({
  name: 'plusPriceDetails'
})
export class PlusPriceDetailsPipe implements PipeTransform {

  transform(value: CartElement, ...args: unknown[]): string {
    var details: string = "("
    console.log('after add')
    details += String(value.price)
    if (value.plusElements.length) {
      value.plusElements.map((plus: PlusElement, i) => {
        details += plus.price + " + "
      })
    } else {
      details += ")"
    }
    return details;
  }

}
