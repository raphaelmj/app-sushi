import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'descListGroup'
})
export class DescListGroupPipe implements PipeTransform {

  transform(value: string[], ...args: unknown[]): unknown {
    value.sort(this.caseInsensitiveSort)
    return this.groupBy(value)
  }

  caseInsensitiveSort(a, b) {
    var ret = 0;
    a = a.toLowerCase();
    b = b.toLowerCase();
    if (a > b)
      ret = 1;
    if (a < b)
      ret = -1;
    return ret;
  }

  groupBy(a: string[]): string[] {

    var newArray: string[] = []
    var array: Array<{ q: number, name: string }> = []

    a.map(el => {
      var isIn: { index: number, bool: boolean } = { index: 0, bool: false }
      array.map((g, i) => {
        if (el == g.name) {
          isIn.index = i
          isIn.bool = true
        }
      })
      if (isIn.bool) {
        array[isIn.index].q++
      } else {
        array.push({ q: 1, name: el })
      }
    })


    array.map((el: { q: number, name: string }) => {
      newArray.push(el.q + "x " + el.name)
    })

    return newArray
  }

}
