import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'groupOptionsTypesQuantity'
})
export class GroupOptionsTypesQuantityPipe implements PipeTransform {

  transform(value: string[]): Array<{ name: string, quantity: number }> {
    var elementsStrings: Array<{ name: string, quantity: number }> = []
    elementsStrings = this.groupAndQuantityCreate(value)
    return elementsStrings;
  }


  groupAndQuantityCreate(value: string[]): Array<{ name: string, quantity: number }> {
    var els: Array<{ name: string, quantity: number }> = []
    value.map((v, i) => {
      var isIn: boolean = false
      var index: number = null
      els.map((el, j) => {
        if (v == el.name) {
          isIn = true
          index = j
        }
      })

      if (!isIn) {
        els.push({ name: v, quantity: 1 })
      } else {
        els[index].quantity++
      }

    })
    return els
  }

}
