import { ElementConfigStepsPrice } from '~/models/menu-element';
import { StepOptionsListElement } from '~/models/cart-element';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'configStepElementName'
})
export class ConfigStepElementNamePipe implements PipeTransform {

  transform(value: StepOptionsListElement, args: ElementConfigStepsPrice[]): string {

    var name = "";
    name += args[value.configFirstIndex].shortName + ' >> ';
    name += args[value.configFirstIndex].types[value.configSecondIndex].type + ' >> ';
    name += args[value.configFirstIndex].types[value.configSecondIndex].options[value.configThirdIndex].shortName

    return name;
  }

}
