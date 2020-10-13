import { API_URL } from '~/config';
import { QuickStats } from './../../models/quick-stats';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CartElement, CartGroup } from '~/models/cart-element';
import { OrderQueryParams } from '~/models/order-query-params';
import { CartOrder, OrderActionType } from '~/models/cart-order';
import { Observable } from 'rxjs';
import { device } from "platform";

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  uuid: string

  constructor(private httpClient: HttpClient) {
    this.uuid = device.uuid
  }

  createOrder(
    cart: CartElement[],
    total: number,
    description: string,
    forWho: string,
    phone: string,
    place: string,
    actionType: OrderActionType,
    userId: number,
    startAt: Date,
    endAt: Date,
    reservation: boolean,
    reservationSize: number,
    onOnePlate: boolean,
    bonusUsed: boolean = false): Promise<any> {
    return this.httpClient.post(API_URL + '/api/orders/create?uuid=' + this.uuid, { cart, total, description, forWho, phone, place, actionType, userId, startAt, endAt, endDay: endAt, reservation, reservationSize, onOnePlate, bonusUsed }).toPromise()
  }

  getOrders(qp: OrderQueryParams): Observable<{
    orders: CartOrder[], total: number, qp: OrderQueryParams, reservations: number, archives: number, inProgress: number
  }> {
    var uri: string = this.paramsToUrl(qp)
    // console.log(uri)
    return this.httpClient.get<{ orders: CartOrder[], total: number, qp: OrderQueryParams, reservations: number, archives: number, inProgress: number }>(API_URL + "/api/orders/app/all?" + uri)
  }

  getDayOrderStats(date: Date): Observable<QuickStats> {
    return this.httpClient.post<QuickStats>(API_URL + '/api/orders/day/quick/stats?uuid=' + this.uuid, { date })
  }

  getDayReservations(day: string): Observable<{ dayR: CartOrder[], soonR: CartOrder[], day: string }> {
    return this.httpClient.get<{ dayR: CartOrder[], soonR: CartOrder[], day: string }>(API_URL + '/api/orders/get/day/reservations?day=' + day + '&uuid=' + this.uuid)
  }

  changeOrderField(field: string, data: any, id: number): Promise<any> {
    return this.httpClient.post(API_URL + '/api/orders/order/field/change?uuid=' + this.uuid, { field, data, id }).toPromise()
  }

  changeOrderFields(data: any, id: number): Promise<any> {
    return this.httpClient.post(API_URL + '/api/orders/order/fields/change?uuid=' + this.uuid, { data, id }).toPromise()
  }

  changeOrderDate(date: any, id: number): Promise<any> {
    // console.log(date)
    return this.httpClient.post(API_URL + '/api/orders/order/date/change?uuid=' + this.uuid, { date, id }).toPromise()
  }

  changeOrderStatus(status: string, id: number): Promise<any> {
    return this.httpClient.post(API_URL + '/api/orders/order/status/change?uuid=' + this.uuid, { status, id }).toPromise()
  }

  getOrder(id: number | string): Observable<{ order: CartOrder, group: CartGroup[] }> {
    return this.httpClient.get<{ order: CartOrder, group: CartGroup[] }>(API_URL + "/api/orders/order/" + id)
  }


  updateOrder(cartEl: CartElement, orderId: number): Promise<any> {
    return this.httpClient.post(API_URL + '/api/orders/order/element/update?uuid=' + this.uuid, { element: cartEl, orderId }).toPromise()
  }


  removeOrder(id: number): Promise<any> {
    return this.httpClient.delete(API_URL + '/api/orders/delete/order/' + id).toPromise()
  }

  bonusSetUnset(id: number, bonusUsed: boolean): Promise<any> {
    return this.httpClient.post(API_URL + '/api/orders/order/bonus/change?uuid=' + this.uuid, { id, bonusUsed }).toPromise()
  }

  removeOrderElement(id: number, orderId: number) {
    return this.httpClient.post(API_URL + '/api/orders/order/element/delete?uuid=' + this.uuid, { id, orderId }).toPromise()
  }


  addNewElementToCart(cartEl: CartElement, orderId: number): Promise<CartElement> {
    return this.httpClient.post<CartElement>(API_URL + '/api/orders/order/add/element?uuid=' + this.uuid, { element: cartEl, orderId }).toPromise()
  }

  changeElementStatus(status: boolean, id: number): Promise<any> {
    return this.httpClient.post<CartElement>(API_URL + '/api/orders/order/element/status/change?uuid=' + this.uuid, { status, id }).toPromise()
  }

  paramsToUrl(qp: OrderQueryParams): string {
    var uri: string = ""
    Object.keys(qp).map((k, i) => {
      uri += `${k}=${qp[k]}`
      if (i < (Object.keys(qp).length - 1)) {
        uri += "&"
      }
    })
    return uri
  }

  urlParamsToObject(urlP: string): any {
    var array: string[] = urlP.split('&')
    var object: {} = {}
    array.map(s => {
      var sa: string[] = s.split("=")
      object[sa[0]] = sa[1]
    })
    return object
  }


}
