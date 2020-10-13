import { ElementConfigStepsPrice } from './../models/menu-element';
import { CartService } from '~/services/cart.service';
import { Pipe, PipeTransform } from '@angular/core';
import { StepOptionsListElement } from '~/models/cart-element';

@Pipe({
  name: 'configStepPrice'
})
export class ConfigStepPricePipe implements PipeTransform {

  constructor(private cartService: CartService) {

  }

  transform(s: StepOptionsListElement, config: ElementConfigStepsPrice[]): number {
    return Number(config[s.configFirstIndex].types[s.configSecondIndex].options[s.configThirdIndex].price)
  }

}
