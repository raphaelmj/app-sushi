import { ElementConfigStepsPrice, MenuElement } from './../models/menu-element';
import { Pipe, PipeTransform } from '@angular/core';
import { StepOptionsListElement } from '~/models/cart-element';

@Pipe({
  name: 'configStepName'
})
export class ConfigStepNamePipe implements PipeTransform {

  transform(value: StepOptionsListElement, element: MenuElement, configStepsPrice: ElementConfigStepsPrice[]): unknown {
    var name = ''
    if (configStepsPrice[value.configFirstIndex].types.length > 0) {
      if (configStepsPrice[value.configFirstIndex].types[value.configSecondIndex].options.length > 0) {
        name =
          element.shortName
          + ' >> '
          + configStepsPrice[value.configFirstIndex].shortName
          + ' >> '
          + configStepsPrice[value.configFirstIndex].types[value.configSecondIndex].type
          + ' >> '
          + configStepsPrice[value.configFirstIndex].types[value.configSecondIndex].options[value.configThirdIndex].shortName
      }
    }
    return name;
  }

}
