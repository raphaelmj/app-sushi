import { Orientation } from 'tns-core-modules/ui/layouts/stack-layout';
import { OrientationChangeService } from './../services/orientation-change.service';
import { CartService } from '~/services/cart.service';
import { ViewContainerRef } from '@angular/core';
import { OrderService } from '~/services/orders/order.service';
import { SelectedIndexChangedEventData } from 'tns-core-modules/ui/tab-view';
import { AfterViewInit } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';
import { RadSideDrawer } from 'nativescript-ui-sidedrawer';
import { RadSideDrawerComponent } from 'nativescript-ui-sidedrawer/angular';
import { ViewChild } from '@angular/core';
import { TokenBase } from './../models/token-base';
import { QPReserve } from './../models/qp-reserve';
import { OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { CartOrder, OrderActionType } from '~/models/cart-order';
import { ActivatedRoute } from '@angular/router';
import { Page } from 'tns-core-modules/ui/page';
import { Component, OnInit } from '@angular/core';
import * as application from "tns-core-modules/application";
import { RouterExtensions } from '@nativescript/angular';
import * as moment from "moment";
require("moment-precise-range-plugin");
import { screen } from "tns-core-modules/platform";
import { on } from "tns-core-modules/application";
import * as ModalPicker from "nativescript-modal-datetimepicker";

@Component({
  selector: 'app-reservations',
  templateUrl: './reservations.component.html',
  styleUrls: ['./reservations.component.scss']
})
export class ReservationsComponent implements OnInit, OnDestroy, AfterViewInit {

  @ViewChild(RadSideDrawerComponent, { static: false })
  public drawerComponent: RadSideDrawerComponent;
  private drawer: RadSideDrawer;
  dayR: CartOrder[];
  soonR: CartOrder[];
  day: string;
  isInit: boolean = true
  backTo: string
  backQueryParams: {} = {}
  qp: QPReserve
  tokenUser: TokenBase
  currentDay: Date
  scrollHeight: number
  orient: Orientation

  subQueryParams: Subscription
  subData: Subscription
  subOrientChange: Subscription

  isInitView: boolean = true

  constructor(
    private page: Page,
    private activatedRoute: ActivatedRoute,
    private routerExtensions: RouterExtensions,
    private _changeDetectionRef: ChangeDetectorRef,
    private orderService: OrderService,
    private viewContainerRef: ViewContainerRef,
    private orientationChangeService: OrientationChangeService,
    private cartService: CartService
  ) {
    this.page.actionBarHidden = true;
    let activity = application.android.startActivity;
    activity.getWindow().addFlags(android.view.View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN);
    this.dayR = this.activatedRoute.snapshot.data['dataR'].dayR
    this.soonR = this.activatedRoute.snapshot.data['dataR'].soonR
    this.day = this.activatedRoute.snapshot.data['dataR'].day
    this.tokenUser = this.activatedRoute.snapshot.data['user']
    this.orient = (screen.mainScreen.heightDIPs > screen.mainScreen.widthDIPs) ? 'vertical' : 'horizontal'
    this.scrollHeight = (this.orient == 'vertical') ? screen.mainScreen.heightDIPs - 60 : screen.mainScreen.widthDIPs - 60;
  }

  ngOnInit(): void {
    this.subscribeToQP()
    this.subscribeToOrientChange()
    this.orientationChangeService.changeEmit()
  }


  subscribeToOrientChange() {
    this.subOrientChange = this.orientationChangeService.action$.subscribe((data: { orient: Orientation, deviceType: 'Phone' | 'Tablet', width?: number, height?: number }) => {
      this.orient = data.orient
      if (!this.isInitView)
        this.afterOrientationDataChange(data.height, data.width)

      this.isInitView = false
      this._changeDetectionRef.detectChanges()
    })
  }

  afterOrientationDataChange(h: number, w: number) {
    switch (this.orient) {
      case "horizontal":
        this.scrollHeight = h - 160;
        break;
      case "vertical":
        this.scrollHeight = w - 160;
        break;
    }
  }

  ngAfterViewInit(): void {
    this.drawer = this.drawerComponent.sideDrawer;
    this._changeDetectionRef.detectChanges();
  }


  subscribeToQP() {
    this.subQueryParams = this.activatedRoute.queryParams.subscribe((p: { day: string, backTo?: string }) => {
      if (!this.isInit) {
        var qp = { ...this.qp, ...p }
        this.qp = Object.assign({}, qp)
        this.getData()
      } else {
        this.isInit = false
        if (p.backTo.indexOf('?') !== -1) {
          var a: string[] = p.backTo.split('?')
          var bp = decodeURIComponent(a[1])
          var qpObject: {} = this.orderService.urlParamsToObject(bp)
          this.backQueryParams = qpObject
          this.backTo = a[0]
        } else {
          this.backTo = p.backTo
        }

        this.qp = Object.assign({}, p)
      }
      this.currentDay = moment(this.qp.day).toDate()
    })
  }

  getData() {
    this.subData = this.orderService.getDayReservations(this.qp.day).subscribe(d => {
      this.dayR = d.dayR
      this.soonR = d.soonR
    })
  }

  onSelectedIndexchanged(event: SelectedIndexChangedEventData) {

  }

  openMenu() {
    this.drawer.showDrawer();
  }

  changeDay() {
    var modal = new ModalPicker.ModalDatetimepicker();
    modal.pickDate({ startingDate: this.currentDay }).then((date) => {
      if (date) {
        var d = new Date();
        d.setFullYear(date.year);
        d.setMonth(date.month - 1);
        d.setDate(date.day);
        d.setHours(0);
        d.setMinutes(0);
        d.setSeconds(0);
        this.qp.day = moment(d).format("yy-MM-DD");
        this.routerExtensions.navigate(['/reservations'], { queryParams: this.qp })
      }
    });
  }

  goBack() {
    this.dayR = []
    this.soonR = []
    this.backQueryParams['saveState'] = 1
    this.routerExtensions.navigate([this.backTo], { queryParams: this.backQueryParams })
  }

  clearBeforeRouteChange() {
    this.dayR = []
    this.soonR = []
  }

  addReservation() {
    var d: Date = moment(this.currentDay).hour((new Date()).getHours()).minutes((new Date()).getMinutes()).second((new Date()).getSeconds()).toDate()
    this.cartService.showModalReservation(
      this.viewContainerRef,
      d,
      { description: "", forWho: "", reservationSize: 0, phone: "" },
      false
    ).then((r: { readyDate: Date, size: number, description: string, forWho: string, phone: string } | boolean) => {
      if (r) {
        r = <{ readyDate: Date, size: number, description: string, forWho: string, phone: string }>r
        r['reservationSize'] = r['size']
        r['endAt'] = moment(r.readyDate).toDate()
        r['endDay'] = moment(r.readyDate).format("yyyy-MM-DD");
        var { size, readyDate, ...rest } = <{ readyDate: Date, size: number, description: string, forWho: string, phone: string, reservationSize: number, endAt: Date, endDay: string }>r
        var end = moment(rest.endAt);
        var start = moment(new Date());
        var startAt: Date = start.toDate()
        if (end.isBefore(start)) {
          startAt = end.toDate()
        }
        this.orderService.createOrder(
          [],
          0,
          rest.description,
          rest.forWho,
          rest.phone,
          "",
          OrderActionType.onSite,
          this.tokenUser.user.id,
          startAt,
          rest.endAt,
          true,
          rest.reservationSize,
          true
        ).then(r => {
          this.getData()
        })
      }
    })
  }

  ngOnDestroy(): void {
    if (this.subQueryParams)
      this.subQueryParams.unsubscribe()

    if (this.subData)
      this.subData.unsubscribe()

    if (this.subOrientChange)
      this.subOrientChange.unsubscribe()
  }

}
