import { DayStats } from './../models/es-day-stats';
import { Orientation } from 'tns-core-modules/ui/layouts/stack-layout';
import { OrientationChangeService } from './../services/orientation-change.service';
import { OnDestroy } from '@angular/core';
import { QPStatsDay } from './../models/qp-stats';
import { Subscription } from 'rxjs';
import { StatisticsService } from './../services/stats/statistics.service';
import { ViewChild } from '@angular/core';
import { RadSideDrawerComponent } from "nativescript-ui-sidedrawer/angular";
import { RadSideDrawer } from "nativescript-ui-sidedrawer";
import { ChangeDetectorRef } from '@angular/core';
import { AfterViewInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TokenBase } from '~/models/token-base';
import { Page } from 'tns-core-modules/ui/page';
import { Component, OnInit } from '@angular/core';
import * as application from "tns-core-modules/application";
import * as moment from "moment";
import * as ModalPicker from "nativescript-modal-datetimepicker";
import { screen, Device } from "tns-core-modules/platform";
import { device } from "platform";
import { RouterExtensions } from '@nativescript/angular';
import { SwipeGestureEventData } from 'tns-core-modules/ui';

@Component({
  selector: 'app-stats',
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.scss']
})
export class StatsComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild(RadSideDrawerComponent, { static: false })
  public drawerComponent: RadSideDrawerComponent;
  private drawer: RadSideDrawer;
  tokenUser: TokenBase | null;
  currentDay: Date;
  qPDay: QPStatsDay
  data: DayStats
  scrollHeight: number = (screen.mainScreen.widthDIPs > screen.mainScreen.heightDIPs) ? screen.mainScreen.heightDIPs - 140 : screen.mainScreen.widthDIPs - 140;
  statsGrid: string = '100,auto'
  statsHeadData: string = 'row'
  fontSize: number = 14
  fontMultiplier: number = 1.5
  initView: boolean = true
  initSize: { w: number, h: number } = { w: screen.mainScreen.widthDIPs, h: screen.mainScreen.heightDIPs }
  initOrient: Orientation = (screen.mainScreen.widthDIPs > screen.mainScreen.heightDIPs) ? 'horizontal' : 'vertical'
  device: Device = device
  loadingStats: boolean = false

  subQPChange: Subscription
  subDayElements: Subscription
  subOrient: Subscription

  constructor(
    private page: Page,
    private activatedRoute: ActivatedRoute,
    private _changeDetectionRef: ChangeDetectorRef,
    private statisticsService: StatisticsService,
    private routerExtensions: RouterExtensions,
    private orientationChangeService: OrientationChangeService
  ) {
    this.tokenUser = this.activatedRoute.snapshot.data["user"];
    this.data = this.activatedRoute.snapshot.data["dayElements"];
    this.qPDay = {
      day: this.data.day
    }
    this.page.actionBarHidden = true;
    let activity = application.android.startActivity;
    activity.getWindow().addFlags(android.view.View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN);
    this.currentDay = moment(this.qPDay.day).toDate();
    // this.prepeareMergeNames()
  }


  ngOnInit(): void {
    this.subToQueryParams()
    this.subscribeToOrientChange()
    this.orientationChangeService.changeEmit()
  }

  ngAfterViewInit(): void {
    this.drawer = this.drawerComponent.sideDrawer;
    this._changeDetectionRef.detectChanges();
  }

  // prepeareMergeNames() {
  //   this.data.list.map((el, i) => {
  //     var n: string = "";
  //     el.names.map((v, i) => {
  //       n += v
  //       if (i != (v.length - 1)) {
  //         n += ', ';
  //       }
  //     })
  //     this.data.list[i].mergeNames = n
  //   })
  // }

  subToQueryParams() {
    this.subQPChange = this.activatedRoute.queryParams.subscribe((p: { day: string }) => {
      if (!this.initView) {
        this.qPDay = Object.assign({}, p)
        this.currentDay = moment(p.day).toDate()
        this.getDayData()
      } else {
        this.initView = false
      }
    })
  }

  subscribeToOrientChange() {
    this.subOrient = this.orientationChangeService.action$.subscribe((data: { orient: Orientation, deviceType: 'Phone' | 'Tablet', width?: number, height?: number }) => {
      this.orientationDataChange(data)
      this.deviceDataSet(data)
      this._changeDetectionRef.detectChanges()
    })
  }

  orientationDataChange(data: { orient: Orientation, deviceType: 'Phone' | 'Tablet', width?: number, height?: number }) {
    switch (data.orient) {
      case 'horizontal':
        this.scrollHeight = data.height - 180;
        this.statsGrid = '100,*'
        this.statsHeadData = 'row'
        break
      case 'vertical':
        this.scrollHeight = data.width - 180;
        this.statsGrid = '100,*'
        this.statsHeadData = 'row'
        if (data.deviceType == 'Phone') {
          this.statsGrid = '200,*'
          this.scrollHeight = data.width - 220;
          this.statsHeadData = 'column'
        }
        break;
    }
    this._changeDetectionRef.detectChanges()
  }

  deviceDataSet(data: { orient: Orientation, deviceType: 'Phone' | 'Tablet', width?: number, height?: number }) {
    switch (data.deviceType) {
      case "Phone":
        this.fontSize = 13
        this.fontMultiplier = 1.5
        break
      case "Tablet":
        this.fontSize = 14
        this.fontMultiplier = 1.5
        break;
    }
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
        this.currentDay = d
        this.qPDay.day = moment(d).format("yy-MM-DD")
        this.routeChange()
      }
    });
  }

  routeChange() {
    this.routerExtensions.navigate(['/stats'], { queryParams: this.qPDay })
  }

  getDayData() {
    this.data = {
      total: 0,
      totalBonus: 0,
      totalCount: 0,
      bonusCart: { ordersCount: 0, total: 0 },
      bonusPercent: {
        ordersCount: 0,
        total: 0,
        details: []
      },
      totalServeTypes: { plate: 0, pack: 0 },
      day: moment(this.currentDay).format("yy-MM-DD"),
      bucketElements: [],
      extra: 0,
      extraPrice: 0
    }
    this.loadingStats = true
    this.subDayElements = this.statisticsService.dayElements(this.qPDay.day).subscribe(r => {
      this.data = r
      this.loadingStats = false
    })
  }

  onSwipeScreen(args: SwipeGestureEventData) {

    switch (args.direction) {
      case 1:
        var m = moment(this.currentDay).add(moment.duration(-1, "days"));
        this.qPDay.day = m.format("yy-MM-DD")
        this.routeChange()
        break;
      case 2:
        var m = moment(this.currentDay).add(moment.duration(1, "days"));
        this.qPDay.day = m.format("yy-MM-DD")
        this.routeChange()
        break;
    }

  }

  ngOnDestroy(): void {
    if (this.subDayElements)
      this.subDayElements.unsubscribe()
    if (this.subQPChange)
      this.subQPChange.unsubscribe()
    if (this.subOrient)
      this.subOrient.unsubscribe()
  }

}
