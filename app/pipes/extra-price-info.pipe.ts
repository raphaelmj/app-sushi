import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'extraPriceInfo'
})
export class ExtraPriceInfoPipe implements PipeTransform {

  transform(value: number, extraPrice: number, quantity: number): string {
    var str: string = '((' + value + ' x extra dodatków = ' + (extraPrice * value) + ' pln)'
    str += ' x ' + quantity + ' szt.) = ' + ((extraPrice * value) * quantity) + ' pln)'
    return str;
  }

}
