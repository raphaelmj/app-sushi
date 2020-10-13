import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'mergeNamesArray'
})
export class MergeNamesArrayPipe implements PipeTransform {

  transform(value: string[]): string {
    var n: string = ''
    value.map((v, i) => {
      n += v
      if (i != (value.length - 1)) {
        n += ', ';
      }
    })
    return n;
  }

}
