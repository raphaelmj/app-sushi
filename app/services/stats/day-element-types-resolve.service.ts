import { StatisticsService } from './statistics.service';
import { BucketPlusElement } from './../../models/es-index-response';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import * as moment from "moment"

@Injectable({
  providedIn: 'root'
})
export class DayElementTypesResolveService implements Resolve<{ list: BucketPlusElement[], total: number, day: string, priceTotal: number, priceExtra: number, bonusPriceTotal: number }> {

  constructor(private statisticsService: StatisticsService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): { list: BucketPlusElement[]; total: number; day: string; priceTotal: number, priceExtra: number, bonusPriceTotal: number } | Observable<{ list: BucketPlusElement[]; total: number; day: string; priceTotal: number; priceExtra: number, bonusPriceTotal: number }> | Promise<{ list: BucketPlusElement[]; total: number; day: string; priceTotal: number; priceExtra: number, bonusPriceTotal: number }> {
    var d: Date = new Date()
    var dayString: string = moment(d).format("yy-MM-DD")
    let day: string = (route.queryParams['day']) ? route.queryParams['day'] : dayString
    return this.statisticsService.dayElements(day)
  }
}