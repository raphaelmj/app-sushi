import { AppConfig } from '~/models/app-config';
import { RefreshAfterCronInprogressService } from './../services/refresh-after-cron-inprogress.service';
import { RefreshAfterDeleteOrderService } from './../services/refresh-after-delete-order.service';
import { CartService } from '~/services/cart.service';
import { VERTICAL_GRID_MIN_TABLET } from "./../config";
import { Component, OnInit, NgZone, ViewChild, ChangeDetectorRef, AfterViewInit, OnDestroy, ViewContainerRef } from "@angular/core";
import { Page } from "tns-core-modules/ui/page";
import { ActivatedRoute, Router } from "@angular/router";
import * as application from "tns-core-modules/application";
import { RadSideDrawerComponent } from "nativescript-ui-sidedrawer/angular";
import { RadSideDrawer } from "nativescript-ui-sidedrawer";
import { OrderQueryParams } from "~/models/order-query-params";
import { CartOrder, OrderStatus, OrderStatusName } from "~/models/cart-order";
import { LIMIT, VERTICAL_GRID, VERTICAL_GRID_PHONE } from "~/config";
import { Subscription, Observable } from "rxjs";
import * as ModalPicker from "nativescript-modal-datetimepicker";
import { OrderService } from "~/services/orders/order.service";
import { TokenBase, UserPerm } from "~/models/token-base";
import { AuthService } from "~/services/auth.service";
import { RefreshOrdersService } from "~/services/refresh-orders.service";
import { SelectElementsInlineComponent } from "~/tools/select-elements-inline/select-elements-inline.component";
import { interval } from "rxjs";
import * as moment from "moment";
import { Device, device } from "platform";
import { screen } from "tns-core-modules/platform";
import { SocketListenService } from "~/services/socket-listen.service";
import { GetDataOrdersRefreshService } from "~/services/get-data-orders-refresh.service";
import { on } from "tns-core-modules/application";
import { QuickStats } from "~/models/quick-stats";
import { SwipeGestureEventData } from 'tns-core-modules/ui';
import { RouterExtensions } from '@nativescript/angular';
import { Orientation } from 'tns-core-modules/ui/layouts/stack-layout';


@Component({
  selector: "app-admin",
  templateUrl: "./admin.component.html",
  styleUrls: ["./admin.component.scss"],
})
export class AdminComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild(RadSideDrawerComponent, { static: false })
  public drawerComponent: RadSideDrawerComponent;
  @ViewChild(SelectElementsInlineComponent, { static: true })
  selectC: SelectElementsInlineComponent;
  private drawer: RadSideDrawer;
  drawerLocation: string = "Right";
  drawerContentSize: number = screen.mainScreen.widthDIPs <= 380 ? Math.ceil(screen.mainScreen.widthDIPs - 20) : 380;
  oQP: OrderQueryParams;
  orders: CartOrder[] = [];
  total: number = 0;
  pages: number = 0;
  subOrders: Subscription;
  subRoute: Subscription;
  subRefresh: Subscription;
  subDataChange: Subscription;
  load: boolean = true;
  tokenUser: TokenBase;
  appConfig: AppConfig
  listInProgress: boolean = false
  screen = screen
  loadingStats: boolean = false

  reservations: number
  archives: number
  inProgress: number

  columnGrid: Array<{ c: number; r: number }>;
  colsGrid: string;
  rowsGrid: string;
  rowsGlobalGrid: string;

  navColumns: string

  statusOptions: Array<{ name: string; value: string }> = [
    { name: OrderStatusName.create, value: OrderStatus.create },
    { name: OrderStatusName.ready, value: OrderStatus.ready },
    { name: OrderStatusName.archive, value: OrderStatus.archive },
  ];

  selectedStatusOptions: string[];
  currentDay: Date;
  subDay: Subscription;
  subQuickStats: Subscription
  subDeleteOrder: Subscription
  subInProgress: Subscription
  dayInterval: Observable<number> = interval(1000 * 60);
  device: Device = device
  orient: Orientation

  constructor(
    private page: Page,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private _changeDetectionRef: ChangeDetectorRef,
    private authService: AuthService,
    private refreshOrdersService: RefreshOrdersService,
    private ordersService: OrderService,
    private socketListenService: SocketListenService,
    private getDataOrdersRefreshService: GetDataOrdersRefreshService,
    private refreshAfterDeleteOrderService: RefreshAfterDeleteOrderService,
    private viewContainerRef: ViewContainerRef,
    private cartService: CartService,
    private routerExtensions: RouterExtensions,
    private refreshAfterCronInprogressService: RefreshAfterCronInprogressService
  ) {
    this.page.actionBarHidden = true;
    let activity = application.android.startActivity;
    activity.getWindow().addFlags(android.view.View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN);
    this.oQP = this.activatedRoute.snapshot.data["ordersData"].qp;
    this.selectedStatusOptions = this.oQP.sts.split("|");
    this.orders = this.activatedRoute.snapshot.data["ordersData"].orders;
    this.tokenUser = this.activatedRoute.snapshot.data["user"];
    this.total = this.activatedRoute.snapshot.data["ordersData"].total;
    this.reservations = this.activatedRoute.snapshot.data["ordersData"].reservations
    this.archives = this.activatedRoute.snapshot.data["ordersData"].archives
    this.inProgress = this.activatedRoute.snapshot.data["ordersData"].inProgress
    this.appConfig = this.activatedRoute.snapshot.data["config"]
    this.countPages();
    this.setViewOrganization();
    this.currentDay = moment(this.oQP.day).toDate();
    this.changeOrientationObserve();
    this.refreshInProgressSubscribe()
  }

  ngOnInit(): void {
    // console.log(device.uuid)
    this.routeChangeWatch();
    this.refreshSubscribe();
    this.refreshAfterDeleteSubscribe();
    this.changeDataSubscribe();
    if (!this.socketListenService.connected) {
      this.socketListenService.startListen(this.tokenUser);
    }
  }

  ngAfterViewInit(): void {
    this.drawer = this.drawerComponent.sideDrawer;
    this._changeDetectionRef.detectChanges();
  }

  setViewOrganization() {
    this.orient = (screen.mainScreen.widthDIPs > screen.mainScreen.heightDIPs) ? 'horizontal' : 'vertical'
    this.navColumns = (this.tokenUser.user.permission == UserPerm.super) ? '80,*,60' : '60,*,60'
    if (device.deviceType == "Tablet") {
      if (screen.mainScreen.heightPixels < screen.mainScreen.widthPixels) {
        if (screen.mainScreen.widthDIPs > 1100) {
          this.columnGrid = VERTICAL_GRID;
          this.colsGrid = "*,*,*";
          this.rowsGrid = "*,*";
          this.rowsGlobalGrid = "auto,*,40";
        } else {
          this.columnGrid = VERTICAL_GRID_MIN_TABLET;
          this.colsGrid = "*,*";
          this.rowsGrid = "*,*,*";
          this.rowsGlobalGrid = "auto,*,40";
        }
      } else {
        this.columnGrid = VERTICAL_GRID_PHONE;
        this.colsGrid = "*";
        this.rowsGrid = "*,*,*,*,*,*";
        this.rowsGlobalGrid = "auto,*,40";
      }
    } else {
      this.columnGrid = VERTICAL_GRID_PHONE;
      this.colsGrid = "*";
      this.rowsGrid = "*,*,*,*,*,*";
      this.rowsGlobalGrid = "auto,*,30";
    }
  }

  changeOrientationObserve() {
    on("orientationChanged", (evt) => {
      this.drawerContentSize = screen.mainScreen.widthDIPs <= 380 ? Math.ceil(screen.mainScreen.widthDIPs - 20) : 380;
      switch (evt.newValue) {
        case "landscape":
          if (screen.mainScreen.widthDIPs > 1100) {
            this.columnGrid = device.deviceType == "Tablet" ? VERTICAL_GRID : VERTICAL_GRID_PHONE;
            this.colsGrid = device.deviceType == "Tablet" ? "*,*,*" : "*";
            this.rowsGrid = device.deviceType == "Tablet" ? "*,*" : "*,*,*,*,*,*";
            this.rowsGlobalGrid = device.deviceType == "Tablet" ? "auto,*,40" : "auto,*,40";
          } else {
            this.columnGrid = device.deviceType == "Tablet" ? VERTICAL_GRID_MIN_TABLET : VERTICAL_GRID_PHONE;
            this.colsGrid = device.deviceType == "Tablet" ? "*,*" : "*";
            this.rowsGrid = device.deviceType == "Tablet" ? "*,*,*" : "*,*,*,*,*,*";
            this.rowsGlobalGrid = device.deviceType == "Tablet" ? "auto,*,40" : "auto,*,40";
          }
          this.orient = 'horizontal'
          break;
        case "portrait":
          this.columnGrid = VERTICAL_GRID_PHONE;
          this.colsGrid = "*";
          this.rowsGrid = "*,*,*,*,*,*";
          this.rowsGlobalGrid = "auto,*,30";
          this.orient = 'vertical'
          break;
      }
      this._changeDetectionRef.detectChanges()
    });
  }

  changeDataSubscribe() {
    this.subDataChange = this.getDataOrdersRefreshService.action$.subscribe((bool) => {
      // console.log(bool)
      if (bool.bool) {
        // if (bool.uuid != device.uuid) {
        this.getData();
        // }
      }
    });
  }

  gotToReserve() {
    var url: string = this.ordersService.paramsToUrl(this.oQP)
    var day = moment(this.currentDay).format("yy-MM-DD");
    this.routerExtensions.navigate(['/reservations'], { queryParams: { backTo: 'admin?' + url, day } })
  }


  intervalDaySubscribe() {
    this.subDay = this.dayInterval.subscribe((d) => { });
  }

  countPages() {
    if (this.total != 0) {
      this.pages = Math.ceil(this.total / LIMIT);
    } else {
      this.pages = 1;
    }
  }

  queryStatuses(event: { sts: string[], paid: 'all' | '0' | '1' | 'none', reservation: '0' | '1' | 'all', inProgress: '0' | '1' | 'all' }) {
    var q: string = event.sts.join("|");
    this.oQP.sts = q;
    this.oQP.paid = event.paid;
    this.oQP.reservation = event.reservation;
    this.oQP.reservation
    this.oQP.inprogress = event.inProgress
    this.oQP.page = 1;
    this.changePage(1);
  }


  refreshSubscribe() {
    this.subRefresh = this.refreshOrdersService.action$.subscribe((bool) => {
      if (bool) {
        this.getData();
      }
    });
  }

  refreshAfterDeleteSubscribe() {
    this.subDeleteOrder = this.refreshAfterDeleteOrderService.action$.subscribe(r => {
      this.getData();
    })
  }

  refreshInProgressSubscribe() {
    this.subInProgress = this.refreshAfterCronInprogressService.action$.subscribe((r: { isChanged: boolean }) => {
      // console.log(r)
      if (r.isChanged) {
        this.getData();
      }
    })
  }

  routeChangeWatch() {
    this.subRoute = this.activatedRoute.queryParams.subscribe((qp: OrderQueryParams) => {
      if (!this.load) {
        this.getOrders(qp);
      } else {
        this.load = false;
      }
    });
  }

  getOrders(qp: OrderQueryParams) {
    this.oQP = Object.assign({}, qp)
    this.getData(true);
  }

  changeStatus(data: { status: string; id: number }) {
    this.ordersService.changeOrderStatus(data.status, data.id).then((r) => {
      // console.log(r, this.oQP)
      // this.getData();
    });
  }

  openMenu() {
    this.drawer.showDrawer();
  }

  changePage(p: number) {
    this.router.navigate(["/admin"], {
      queryParams: { page: p, sts: this.oQP.sts, day: this.oQP.day, paid: this.oQP.paid, reservation: this.oQP.reservation, inprogress: this.oQP.inprogress },
    });
  }

  refreshData() {
    this.oQP.page = 1;
    this.getData(true);
  }

  showStats() {
    this.loadingStats = true
    this.subQuickStats = this.ordersService.getDayOrderStats(this.currentDay).subscribe((quickStats: QuickStats) => {
      this.loadingStats = false
      this.cartService.showModalQuickStats(this.viewContainerRef, this.currentDay, quickStats)
    })
  }

  getData(pageOrRefresh: boolean = false) {
    // console.log(this.oQP);
    if (pageOrRefresh)
      this.listInProgress = true

    this.subOrders = this.ordersService.getOrders(this.oQP).subscribe((data) => {
      this.total = data.total;
      this.orders = data.orders;
      this.oQP = data.qp;
      this.reservations = data.reservations
      this.archives = data.archives
      this.inProgress = data.inProgress
      this.countPages();
      if (pageOrRefresh)
        this.listInProgress = false
      // console.log(this.pages);
      // console.log("/", this.total, this.pages, Number(this.oQP.page));
      if (this.pages < Number(this.oQP.page)) {
        this.oQP.page = Number(this.oQP.page) - 1;
        this.getData();
      }
    });
  }

  logOut() {
    this.authService.logOut().then((r) => {
      this.router.navigate(["/login"]);
    });
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
        this.oQP.day = moment(d).format("yy-MM-DD");
        this.currentDay = d;
        this.getData();
      }
    });
  }


  onSwipeScreen(args: SwipeGestureEventData) {
    switch (args.direction) {
      case 1:
        if (this.oQP.page > 1) {
          var pag = Number(this.oQP.page) - 1
          this.changePage(pag)
        }
        break;
      case 2:
        if (this.pages > this.oQP.page) {
          var pag = Number(this.oQP.page) + 1
          this.changePage(pag)
        }
        break;
    }
  }

  ngOnDestroy(): void {
    if (this.subOrders) this.subOrders.unsubscribe();
    if (this.subRoute) this.subRoute.unsubscribe();
    if (this.subRefresh) this.subRefresh.unsubscribe();
    if (this.subDay) this.subDay.unsubscribe();
    if (this.subDataChange) this.subDataChange.unsubscribe();
    if (this.subQuickStats) this.subQuickStats.unsubscribe()
    if (this.subDeleteOrder) this.subDeleteOrder.unsubscribe()
    if (this.subInProgress) this.subInProgress.unsubscribe()
    // this.socketIO.disconnect();
    // console.log("dest");
  }
}
