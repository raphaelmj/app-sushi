import { CalculateService } from './../services/calculate/calculate.service';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'extraPriceSimple'
})
export class ExtraPriceSimplePipe implements PipeTransform {

  constructor(private CalculateService: CalculateService) {

  }

  transform(value: number, extraPrice: number): string {
    // var total: number = this.c
    var s: string = value + ' x ' + extraPrice + ' pln'
    return s;
  }

}
