import { DayStats } from './../../models/es-day-stats';
import { StatisticsService } from './statistics.service';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import * as moment from "moment"

@Injectable({
  providedIn: 'root'
})
export class DayElementTypesResolveService implements Resolve<DayStats> {

  constructor(private statisticsService: StatisticsService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): DayStats | Observable<DayStats> | Promise<DayStats> {
    var d: Date = new Date()
    var dayString: string = moment(d).format("yy-MM-DD")
    let day: string = (route.queryParams['day']) ? route.queryParams['day'] : dayString
    return this.statisticsService.dayElements(day)
  }
}