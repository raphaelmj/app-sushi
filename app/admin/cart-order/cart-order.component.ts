import { BonusType } from './../../models/cart-order';
import { ConfirmPasswordType } from './../../tools/password-confirm/password-confirm.component';
import { MessageService } from './../../services/message.service';
import { GetDataOrdersRefreshService } from '~/services/get-data-orders-refresh.service';
import { CalculateService } from './../../services/calculate/calculate.service';
import { OrientationChangeService } from './../../services/orientation-change.service';
import { SpecialElementComponent } from './../../tools/special-element/special-element.component';
import { SelectedIndexChangedEventData, TabView } from "tns-core-modules/ui/tab-view";
import { MenuCategory } from "./../../models/menu-category";
import { MenuElement } from "./../../models/menu-element";
import { Component, OnInit, NgZone, ChangeDetectorRef, AfterViewInit, ViewChild, OnDestroy, ViewContainerRef, AfterContentInit } from "@angular/core";
import * as application from "tns-core-modules/application";
import { RadSideDrawerComponent } from "nativescript-ui-sidedrawer/angular";
import { RadSideDrawer } from "nativescript-ui-sidedrawer";
import { CartOrder } from "~/models/cart-order";
import { Subscription } from "rxjs";
import { OrderService } from "~/services/orders/order.service";
import { Page } from "tns-core-modules/ui/page";
import { ActivatedRoute, Router } from "@angular/router";
import { CartGroup, CartElement } from "~/models/cart-element";
import { CartService } from "~/services/cart.service";
import { AuthService } from "~/services/auth.service";
import { TokenBase } from "~/models/token-base";
import { ReverseOptions } from "~/models/reverse-options";
import { DescOptions } from "~/models/desc-options";
import * as moment from "moment";
import * as Toast from "nativescript-toast";
import { ModalDialogService, ModalDialogOptions, RouterExtensions } from "@nativescript/angular";
import { FullOptionsGroup } from "~/models/full-options-group";
import { OrderElementStatusChangeRefreshService } from "~/services/order-element-status-change-refresh.service";
import { screen } from "tns-core-modules/platform";
import { on } from "tns-core-modules/application";
import { CartCategory } from "~/models/cart-category";
import { AppConfig } from '~/models/app-config';
import * as ModalPicker from "nativescript-modal-datetimepicker";
import { Orientation } from 'tns-core-modules/ui/layouts/stack-layout';

@Component({
  selector: "app-cart-order",
  templateUrl: "./cart-order.component.html",
  styleUrls: ["./cart-order.component.scss"],
})
export class CartOrderComponent implements OnInit, AfterViewInit, OnDestroy, AfterContentInit {
  @ViewChild(RadSideDrawerComponent, { static: false })
  public drawerComponent: RadSideDrawerComponent;
  private drawer: RadSideDrawer;
  drawerLocation: string = "Right";
  drawerContentSize: number = screen.mainScreen.widthDIPs <= 400 ? Math.ceil(screen.mainScreen.widthDIPs) : 400;
  isMenuDrawerOpened: boolean = false;

  @ViewChild(TabView, { static: false }) tabViewComponent: TabView
  selectedIndex: number = 0

  cartGroups: CartGroup[] = [];
  order: CartOrder;
  total: number = 0;
  dishes: number = 0;
  subRefresh: Subscription;
  subDataOrderChange: Subscription
  loading: boolean = false;

  groupIndexes: {} = {};
  elementOptions: { desc: DescOptions[]; reverse: ReverseOptions[] };
  appConfig: AppConfig

  menuElementsFull: MenuCategory[] = [];
  cartCategories: CartCategory[] = [];
  carts: Array<{ name: string; elements: MenuElement[] }> = [];

  plusCartCategories: CartCategory[]

  tokenUser: TokenBase;
  addInProgress: boolean = false;

  menuHeight: number = Math.ceil(screen.mainScreen.heightDIPs) - 60;

  subOrientChange: Subscription
  isInitView: boolean = true
  orient: Orientation

  bonusType = BonusType

  constructor(
    private page: Page,
    private cartService: CartService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private _changeDetectionRef: ChangeDetectorRef,
    private authService: AuthService,
    private ordersService: OrderService,
    private viewContainerRef: ViewContainerRef,
    private modalService: ModalDialogService,
    private orderElementStatusChangeRefreshService: OrderElementStatusChangeRefreshService,
    private orderService: OrderService,
    private routerExtensions: RouterExtensions,
    private orientationChangeService: OrientationChangeService,
    private calculateService: CalculateService,
    private messageService: MessageService,
    private getDataOrdersRefreshService: GetDataOrdersRefreshService
  ) {
    this.page.actionBarHidden = true;
    let activity = application.android.startActivity;
    activity.getWindow().addFlags(android.view.View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN);
    this.cartGroups = this.activatedRoute.snapshot.data["orderData"].group;
    this.order = this.activatedRoute.snapshot.data["orderData"].order;
    this.tokenUser = this.activatedRoute.snapshot.data["user"];
    this.elementOptions = this.activatedRoute.snapshot.data["options"];
    this.plusCartCategories = this.activatedRoute.snapshot.data["plusCartCategories"]

    this.total = this.calculateService.stringToNumber(this.order.total);

    this.cartCategories = this.activatedRoute.snapshot.data["cartCategories"];
    this.menuElementsFull = this.activatedRoute.snapshot.data["menuElements"];
    this.appConfig = this.activatedRoute.snapshot.data["config"];



  }

  ngOnInit(): void {
    // this.changeOrientationObserve();
    this.cartSum();
    this.findGroupIndexes();
    this.changeElementStatusSubscribe();
    this.subscribeToOrientChange()
    this.changeOrderSubscribe()
    // this.orientationChangeService.changeEmit()
  }

  subscribeToOrientChange() {
    this.subOrientChange = this.orientationChangeService.action$.subscribe((data: { orient: Orientation, deviceType: 'Phone' | 'Tablet', width?: number, height?: number }) => {
      this.orient = data.orient
      if (!this.isInitView) {
        this.changeMenuHeight(data.orient)
      }
      this.drawerContentSize = screen.mainScreen.widthDIPs <= 400 ? Math.ceil(screen.mainScreen.widthDIPs) : 400;
      this.isInitView = false
      this._changeDetectionRef.detectChanges()
    })
  }

  ngAfterViewInit(): void {
    this.drawer = this.drawerComponent.sideDrawer;
    this._changeDetectionRef.detectChanges();
  }

  ngAfterContentInit(): void {
    this.carts = this.menuElementsFull.map((el) => {
      return { name: el.name, fullName: el.fullName, bgColor: el.bgColor, fontColor: el.fontColor, elements: [] };
    });
  }

  changeMenuHeight(orient: Orientation) {
    switch (orient) {
      case "vertical":
        this.menuHeight = Math.ceil(screen.mainScreen.widthDIPs) - 60;
        break
      case "horizontal":
        this.menuHeight = Math.ceil(screen.mainScreen.heightDIPs) - 60;
        break;
    }
  }


  gotToReserve() {
    var day = moment(new Date()).format("yy-MM-DD");
    this.routerExtensions.navigate(['/reservations'], { queryParams: { backTo: 'order/' + this.order.id, day } })
  }

  changeDay() {
    var endDate: Date = new Date(this.order.endAt);
    var modal = new ModalPicker.ModalDatetimepicker();
    var m = moment(endDate)
    modal
      .pickDate({ startingDate: endDate, datePickerMode: "spinner" })
      .then((day) => {
        if (day) {
          m.date(day.day).month(day.month - 1).year(day.year)
          // endDate.setDate(day.day);
          // endDate.setMonth(day.month - 1);
          // endDate.setFullYear(day.year);
          endDate = m.toDate()
          // console.log(endDate)
          this.orderService
            .changeOrderDate(endDate, this.order.id)
            .then((r) => {
              // this.refreshOrdersService.makeRefresh()
            });
        }
      });
  }

  changeDateTime() {
    var endDate: Date = new Date(this.order.endAt);
    var modal = new ModalPicker.ModalDatetimepicker();
    var m = moment(endDate)
    modal
      .pickTime({
        startingHour: endDate.getHours(),
        startingMinute: endDate.getMinutes(),
      })
      .then((time) => {
        if (time) {
          m.hour(time.hour).minute(time.minute)
          // endDate.setHours(time.hour);
          // endDate.setMinutes(time.minute);
          endDate = m.toDate()
          // console.log(time, endDate)
          this.orderService
            .changeOrderDate(endDate, this.order.id)
            .then((r) => {
              // this.refreshOrdersService.makeRefresh()
            });
        }
      });
  }

  setEditInfo() {
    this.cartService.showModalReservationData(this.viewContainerRef, {
      reservationSize: this.order.reservationSize,
      description: this.order.description,
      phone: this.order.phone,
      forWho: this.order.forWho,
    }, (this.order.reservation) ? false : true).then((data: boolean | { description: string, forWho: string, phone: string, reservationSize: number }) => {
      if (data) {
        let d: { description: string, forWho: string, phone: string, reservationSize: number } = <{ description: string, forWho: string, phone: string, reservationSize: number }>data
        if (!this.order.reservation) {
          let { reservationSize, ...rest } = d
          // console.log(rest)
          this.orderService.changeOrderFields(rest, this.order.id).then(r => {
            this.order = { ...this.order, ...rest }
          })
        } else {
          this.orderService.changeOrderFields(d, this.order.id).then(r => {
            this.order = { ...this.order, ...d }
          })
        }

      }
    })
  }


  setUnsetAsReservation() {
    if (this.order.reservation) {

    } else[

    ]
  }


  changeElementStatusSubscribe() {
    this.subRefresh = this.orderElementStatusChangeRefreshService.action$.subscribe((data) => {
      var d: { orderId: number; elementId: number; status: boolean } = data;
      if (this.order.id == d.orderId) {
        this.findInOrdersChangeStatus(d);
        this.findInGroupChangeStatus(d);
      }
    });
  }


  changeOrderSubscribe() {
    this.subDataOrderChange = this.getDataOrdersRefreshService.action$.subscribe((data: { bool: boolean, uuid: string, order: CartOrder }) => {
      if (this.order.id == data.order.id) {
        this.order = { ...this.order, ...data.order }
      }
    });
  }



  findInOrdersChangeStatus(d: { orderId: number; elementId: number; status: boolean }) {
    this.order.cartOrderElements.map((el, i) => {
      if (el.id == d.elementId) {
        this.order.cartOrderElements[i].status = d.status;
      }
    });
  }

  findInGroupChangeStatus(d: { orderId: number; elementId: number; status: boolean }) {
    this.cartGroups.map((g, i) => {
      g.elements.map((el, j) => {
        if (el.id == d.elementId) {
          this.cartGroups[i].elements[j].status = d.status;
        }
      });
    });
  }

  openDrawer(position: "Left" | "Right") {
    this.drawerLocation = position;
    // this.drawerContentSize = size;
    setTimeout(() => {
      this.drawer.showDrawer();
    });
  }

  openMenuDrawer(position: "Left" | "Right") {
    this.openDrawer(position);
  }

  onSelectedIndexchanged(event: SelectedIndexChangedEventData) {
    this.selectedIndex = event.newIndex
    if (event.newIndex != 0) {
      if (this.carts[event.newIndex - 1].elements.length == 0) {
        this.carts[event.newIndex - 1].elements = this.menuElementsFull[event.newIndex - 1].elements;
      }
    }

  }

  changeTab(i: number) {
    this.carts[i].elements = this.menuElementsFull[i].elements;
    this.selectedIndex = i + 1
  }

  toTabHome() {
    this.selectedIndex = 0
  }

  closeDrawer() {
    this.drawer.closeDrawer();
  }

  cartSum() {
    // this.total = 0;
    var ps: Array<string | number> = []
    this.order.cartOrderElements.map((cel) => {
      // this.total += parseFloat(<any>cel.price);
      ps.push(cel.price)
    });
    // console.log(this.calculateService.pricePlusMapElements(0, ps), ps)
    this.total = this.calculateService.pricePlusMapElements(0, ps)
    // console.log('beforeSum', this.order.bonusTotal)
    if (this.order.bonusUsed && this.order.bonusType != BonusType.none) {

      switch (this.order.bonusType) {
        case BonusType.cart:
          if (this.calculateService.stringToNumber(this.order.currentBonusPrice) >= this.total) {
            this.order.bonusTotal = 0
          } else {
            this.order.bonusTotal = this.calculateService.minusElements(this.total, this.order.currentBonusPrice)
          }
          break
        case BonusType.percent:
          var percent: number = this.calculateService.stringToNumber(this.order.currentBonusPercent)
          if (percent == 0) {
            this.order.bonusTotal = this.calculateService.stringToNumber(this.total)
          } else {
            var percentValue: number = this.calculateService.percentFind(percent, this.total)
            this.order.bonusTotal = this.calculateService.minusElements(this.total, percentValue)
          }
          break;
      }

    }

    // console.log('after', this.order.bonusTotal)
    this._changeDetectionRef.detectChanges()

    this.dishes = 0;
    this.order.cartOrderElements.map((cel) => {
      this.dishes += cel.quantity;
    });
  }

  updateCart(data: { cartEl: CartElement, date: Date, index: number }) {
    this.loading = true;
    data.cartEl.status = false;
    // console.log(data.cartEl)
    this.ordersService.updateOrder(data.cartEl, this.order.id).then((o: CartOrder) => {
      this.order = { ...this.order, ...{ bonusTotal: o.bonusTotal, total: o.total } }
      this.loading = false;
      if (data.cartEl.elementType == "special") {
        this.findElementAndUpdateById(data.cartEl);
      } else {
        this.findElementAndUpdate(data.cartEl);
      }

    });
  }

  findElementAndUpdate(cartEl: CartElement) {
    var index: number = this.cartService.findElementIndexById(this.order.cartOrderElements, cartEl);
    this.order.cartOrderElements[index] = cartEl;
    this.cartSum();
  }

  findElementAndUpdateById(cartEl: CartElement) {
    var index: number = this.cartService.findElementIndexById(this.order.cartOrderElements, cartEl);
    this.order.cartOrderElements[index] = cartEl;
    this.cartSum();
  }

  remove(data: { cartEl: CartElement, index: number }) {
    var { cartEl } = data
    this.ordersService.removeOrderElement(cartEl.id, this.order.id).then((o: CartOrder) => {
      this.order = { ...this.order, ...{ bonusTotal: o.bonusTotal } }
      var gIndex: number = this.cartService.findGroupIndex(this.cartGroups, cartEl);
      var elIndex: number = this.cartService.findElementIndexById(this.order.cartOrderElements, cartEl);
      var groupElIndex: number = 0
      if (cartEl.elementType == "special") {
        this.cartGroups[gIndex].elements.map((e, i) => {
          if (e.id == cartEl.id) {
            groupElIndex = i
          }
        })
      } else {
        groupElIndex = this.cartService.findGroupElementIndex(this.cartGroups[gIndex], cartEl);
      }


      this.order.cartOrderElements.splice(elIndex, 1);
      this.cartGroups[gIndex].elements.splice(groupElIndex, 1);
      this.cartSum();
    });
  }

  addSpecial() {
    var options: ModalDialogOptions = {
      context: {
        elementOptions: this.elementOptions,
        appConfig: this.appConfig,
        onOnePlate: this.order.onOnePlate,
        orderActionType: this.order.actionType
      },
      viewContainerRef: this.viewContainerRef,
      fullscreen: true,
    };
    this.modalService.showModal(SpecialElementComponent, options).then((r: { isOptions: true, data: FullOptionsGroup, price: string }) => {

      if (r) {
        var cartEl: CartElement = this.cartService.createCartSpecialElement(r.data, this.cartCategories, r.price)
        this.cartUpdatePush(cartEl).then(r => {
          this.cartSum();
        })
      }

    });
  }


  addToCart(data: { element: MenuElement; index: number; priceNameIndex: number | null; boolean; asSimple?: boolean }) {
    this.addInProgress = true;
    this.isInitView = true
    this.setElementPlus(data.element, data.index, data.priceNameIndex, data.element.cartCategory, data.asSimple).then((r) => {
      this.cartSum();
      this.addInProgress = false;
    });
  }

  setElementPlus(element: MenuElement, index: number | null, priceNameIndex: number | null, type: CartCategory, asSimple: boolean): Promise<boolean> {
    return this.cartService.showInitOptionsPlusModal(
      element,
      index,
      priceNameIndex,
      { plusCartCategories: this.plusCartCategories, elementOptions: this.elementOptions },
      this.viewContainerRef,
      this.appConfig,
      this.order.onOnePlate,
      this.order.actionType
    ).then((r: FullOptionsGroup | boolean) => {
      if (r) {
        var cartEl: CartElement = this.cartService.createCartElement(element, <FullOptionsGroup>r, type);
        this.cartUpdatePush(cartEl);
        return true;
      } else {
        return false;
      }
    })

  }


  findGroupIndexes() {
    this.cartGroups.map((g, i) => {
      this.groupIndexes[g.type.alias] = i;
    });
  }

  cartUpdatePush(cartEl: CartElement): Promise<any> {
    return this.ordersService.addNewElementToCart(cartEl, this.order.id).then((r: { o: CartOrder, ce: CartElement }) => {
      this.order = { ...this.order, ...{ bonusTotal: r.o.bonusTotal } }
      this.order.cartOrderElements.push(r.ce);
      this.putElementToGroup(r.ce.type, r.ce);
      this.cartSum();
    });
  }

  putElementToGroupUpdateQuantity(anchor: CartCategory, cartEl: CartElement): CartElement {
    var i: number = this.groupIndexes[anchor.alias];
    var cartElement: CartElement;
    this.cartGroups[i].elements.map((el, j) => {
      if (cartEl.ind) {
        if (el.ind.id == cartEl.ind.id && el.ind.index == cartEl.ind.index) {
          this.cartGroups[i].elements[j].quantity = cartEl.quantity;
          this.cartGroups[i].elements[j].price = cartEl.price;
          cartElement = this.cartGroups[i].elements[j];
        }
      }
    });
    return cartElement;
  }

  putElementToGroup(anchor: CartCategory, cartEl: CartElement) {
    var i: number = this.groupIndexes[anchor.alias];
    this.cartGroups[i].elements.push(cartEl);
  }

  findIsElementInCart(cartEl: CartElement): { bool: boolean; cartIndex: number | null } {
    var bool: boolean = false;
    var cartIndex: number | null = null;

    this.order.cartOrderElements.map((el, i) => {
      if (cartEl.ind) {
        if (el.ind.id == cartEl.element.id && el.ind.index == cartEl.ind.index) {
          bool = true;
          cartIndex = i;
        }
      }
    });

    return { bool, cartIndex };
  }

  // removeOrder() {
  //   this.messageService.confirmMake('Czy chcesz usunąć zamówienie?').then(bool => {
  //     if (bool) {
  //       this.cartService.showModalCheckSomePassword(this.viewContainerRef, ConfirmPasswordType.backend).then(bool => {
  //         if (bool) {

  //         }
  //       })
  //     }
  //   })
  // }

  logOut() {
    this.authService.logOut().then((r) => {
      this.router.navigate(["/login"]);
    });
  }

  ngOnDestroy(): void {
    if (this.subRefresh) this.subRefresh.unsubscribe();
    if (this.subOrientChange) this.subOrientChange.unsubscribe()
    if (this.subDataOrderChange) this.subDataOrderChange.unsubscribe()
  }
}
