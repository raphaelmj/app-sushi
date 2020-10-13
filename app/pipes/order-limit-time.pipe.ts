import { Pipe, PipeTransform } from '@angular/core';
import { DateDiff } from '~/models/date-diff';

@Pipe({
  name: 'orderLimitTime'
})
export class OrderLimitTimePipe implements PipeTransform {

  transform(value: DateDiff, ...args: unknown[]): string {
    var dateString: string = ""
    if (value.firstDateWasLater) {
      dateString += "- "
      if (value.days) {
        dateString += value.days + " dni "
      }
      dateString += value.hours + ":" + this.numberToTimeString(value.minutes) + ":" + this.numberToTimeString(value.seconds)
    } else {
      dateString += "+ "
      if (value.days) {
        dateString += value.days + " dni "
      }
      dateString += value.hours + ":" + this.numberToTimeString(value.minutes) + ":" + this.numberToTimeString(value.seconds)
    }
    return dateString
  }

  numberToTimeString(number: number): string {
    if (number > 9) {
      return String(number)
    } else {
      return "0" + number
    }
  }

}
