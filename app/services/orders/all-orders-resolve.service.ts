import { DataService } from './../data.service';
import { AppConfig, FilterState } from './../../models/app-config';
import { TokenBase } from './../../models/token-base';
import { AuthService } from '~/services/auth.service';
import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { CartOrder } from '~/models/cart-order';
import { OrderService } from './order.service';
import { Observable } from 'rxjs';
import { OrderQueryParams } from '~/models/order-query-params';
import * as moment from "moment"

@Injectable({
  providedIn: 'root'
})
export class AllOrdersResolveService implements Resolve<{ orders: CartOrder[], total: number, qp: OrderQueryParams, reservations: number, archives: number, inProgress: number }> {

  constructor(private orderService: OrderService, private authService: AuthService, private dataService: DataService) { }

  async resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<{ orders: CartOrder[], total: number, qp: OrderQueryParams, reservations: number, archives: number, inProgress: number }> {

    const token: TokenBase | null = await this.authService.getTokenUser()
    const appConfig: AppConfig = await this.dataService.getAppConfig().toPromise()
    var data: OrderQueryParams

    var d: Date = new Date()
    var dayString: string = moment(d).format("yy-MM-DD")

    // if (route.queryParams['saveState'] == '1') {
    //   data = this.getParamsFree(route, dayString)
    //   return await this.orderService.getOrders(data).toPromise()
    // }

    if (token) {

      switch (token.user.role) {

        case "admin":

          data = this.getParamsAdmin(route, dayString, appConfig.data.defaultFiltersStates.admin)

          break;

        case "waiter":
          data = this.getParamsWaiter(route, dayString, appConfig.data.defaultFiltersStates.waiter)
          break;

        default:
          data = this.getParamsWaiter(route, dayString, appConfig.data.defaultFiltersStates.waiter)
          break

      }

    } else {
      data = this.getParamsWaiter(route, dayString, appConfig.data.defaultFiltersStates.waiter)
    }


    return await this.orderService.getOrders(data).toPromise()

  }


  getParamsAdmin(route: ActivatedRouteSnapshot, dayString: string, fstate: FilterState): OrderQueryParams {
    var stsJoin = fstate.sts.join('|')
    let page = (route.queryParams['page']) ? route.queryParams['page'] : 1
    let sts = (route.queryParams['sts']) ? route.queryParams['sts'] : stsJoin
    let day = (route.queryParams['day']) ? route.queryParams['day'] : dayString
    let paid: 'all' | '0' | '1' | 'none' = (route.queryParams['paid']) ? route.queryParams['paid'] : fstate.paid
    let reservation: '0' | '1' | 'all' = (route.queryParams['reservation']) ? route.queryParams['reservation'] : fstate.reservation
    let inprogress: '0' | '1' | 'all' = (route.queryParams['inprogress']) ? route.queryParams['inprogress'] : fstate.inprogress
    return { page, sts, day, paid, reservation, inprogress }
  }

  getParamsWaiter(route: ActivatedRouteSnapshot, dayString: string, fstate: FilterState): OrderQueryParams {
    var stsJoin = fstate.sts.join('|')
    let page = (route.queryParams['page']) ? route.queryParams['page'] : 1
    let sts = (route.queryParams['sts']) ? route.queryParams['sts'] : stsJoin
    let day = (route.queryParams['day']) ? route.queryParams['day'] : dayString
    let paid: 'all' | '0' | '1' | 'none' = (route.queryParams['paid']) ? route.queryParams['paid'] : fstate.paid
    let reservation: '0' | '1' | 'all' = (route.queryParams['reservation']) ? route.queryParams['reservation'] : fstate.reservation
    let inprogress: '0' | '1' | 'all' = (route.queryParams['inprogress']) ? route.queryParams['inprogress'] : fstate.inprogress
    return { page, sts, day, paid, reservation, inprogress }
  }

  getParamsFree(route: ActivatedRouteSnapshot, dayString: string): OrderQueryParams {
    let page = (route.queryParams['page']) ? route.queryParams['page'] : 1
    let sts = (route.queryParams['sts']) ? route.queryParams['sts'] : 'create|ready'
    let day = (route.queryParams['day']) ? route.queryParams['day'] : dayString
    let paid: 'all' | '0' | '1' | 'none' = (route.queryParams['paid']) ? route.queryParams['paid'] : '0'
    let reservation: '0' | '1' | 'all' = (route.queryParams['reservation']) ? route.queryParams['reservation'] : '0'
    let inprogress: '0' | '1' | 'all' = (route.queryParams['inprogress']) ? route.queryParams['inprogress'] : 'all'
    return { page, sts, day, paid, reservation, inprogress }
  }

}
