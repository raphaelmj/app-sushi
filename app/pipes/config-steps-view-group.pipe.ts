import { ElementConfigStepsPrice } from '~/models/menu-element';
import { ElementType } from './../models/cart-element';
import { PlusElement, StepOptionsListElement } from '~/models/cart-element';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'configStepsViewGroup'
})
export class ConfigStepsViewGroupPipe implements PipeTransform {

  transform(value: PlusElement): Array<{ step: StepOptionsListElement, quantity: number, name: null | string }> {
    var plusElms: Array<{ step: StepOptionsListElement, quantity: number, name: null | string }> = []
    if (value.elementType == ElementType.configStepsPriceMany) {
      plusElms = this.iterPlusElements(value.stepOptionsList, value.configStepsPrice)
    }
    return plusElms;
  }


  iterPlusElements(value: StepOptionsListElement[], config: ElementConfigStepsPrice[]): Array<{ step: StepOptionsListElement, quantity: number, name: null | string }> {
    var elms: Array<{ step: StepOptionsListElement, quantity: number, name: null | string }> = []
    value.map((pl, i) => {
      var isIn: boolean = false
      var index: number = null
      elms.map((p, j) => {
        if ((pl.configFirstIndex == p.step.configFirstIndex) && (pl.configSecondIndex == p.step.configSecondIndex) && (pl.configThirdIndex == p.step.configThirdIndex)) {
          isIn = true
          index = j
        }
      })
      if (!isIn) {
        elms.push({ step: pl, quantity: 1, name: null })
      } else {
        elms[index].quantity++
      }

    })
    elms.map((value, i) => {
      elms[i].name = '';
      elms[i].name += config[value.step.configFirstIndex].shortName + ' >> ';
      elms[i].name += config[value.step.configFirstIndex].types[value.step.configSecondIndex].type + ' >> ';
      elms[i].name += config[value.step.configFirstIndex].types[value.step.configSecondIndex].options[value.step.configThirdIndex].shortName

    })
    return elms
  }


}
