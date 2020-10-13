import { DatePosition } from './../models/cart-order';
import { Pipe, PipeTransform } from '@angular/core';
import * as moment from "moment";
require("moment-precise-range-plugin");
import { DateDiff } from "~/models/date-diff";

@Pipe({
  name: 'daySuffix'
})
export class DaySuffixPipe implements PipeTransform {

  transform(orderDay: Date, currentDay: Date, dPos: DatePosition): string {
    var cD = moment(moment(currentDay).format('YYYY-MM-DD'));
    var oDay = moment(orderDay)
    if (dPos == DatePosition.after) {
      var ob = moment.preciseDiff(cD, oDay, true)
      return "/+" + ob.days + "d"
    }

    if (dPos == DatePosition.before) {
      var ob = moment.preciseDiff(oDay, cD, true)
      return "/-" + ob.days + "d"
    }

    return '';
  }

}
