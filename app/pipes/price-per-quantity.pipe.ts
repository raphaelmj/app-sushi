import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'pricePerQuantity'
})
export class PricePerQuantityPipe implements PipeTransform {

  transform(qunatity: number, pricePerOne: string): unknown {
    return (qunatity * Number(pricePerOne)) + " pln"
  }

}
