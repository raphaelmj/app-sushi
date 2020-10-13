import { CalculateService } from './../services/calculate/calculate.service';
import { ElementType } from './../models/cart-element';
import { OrientationChangeService } from './../services/orientation-change.service';
import { MenuElement } from '~/models/menu-element';
import { StepOptionsComponent } from './../tools/step-options/step-options.component';
import { SpecialElementComponent } from './../tools/special-element/special-element.component';
import { MenuCategory } from "./../models/menu-category";
import { Component, OnInit, ViewChild, ChangeDetectorRef, ViewContainerRef, OnDestroy, AfterViewInit, AfterContentInit } from "@angular/core";
import * as application from "tns-core-modules/application";
import { Observable, Subscription } from "rxjs";
import { SiteElement, ElementOptionType } from "~/models/site";
import { CartElement, CartGroup, ServeType } from "~/models/cart-element";
import { TokenBase } from "~/models/token-base";
import { FormGroup, FormBuilder } from "@angular/forms";
import { RadSideDrawerComponent } from "nativescript-ui-sidedrawer/angular";
import { RadSideDrawer } from "nativescript-ui-sidedrawer";
import { Page } from "tns-core-modules/ui/page";
import { ActivatedRoute, Router } from "@angular/router";
import { OrderService } from "~/services/orders/order.service";
import { CartService } from "~/services/cart.service";
import { AuthService } from "~/services/auth.service";
import { action } from "tns-core-modules/ui/dialogs";
import * as ModalPicker from "nativescript-modal-datetimepicker";
import { OrderActionType, OrderActionTypeNames } from "~/models/cart-order";
import * as moment from "moment";
import { PLUS_MINUTES } from "~/config";
import { ReverseOptions } from "~/models/reverse-options";
import { DescOptions } from "~/models/desc-options";
import { MessageService } from "~/services/message.service";
import { ModalDialogOptions, ModalDialogService, RouterExtensions } from "@nativescript/angular";
import { PlusTimeComponent } from "~/tools/plus-time/plus-time.component";
import * as Toast from "nativescript-toast";
import { FullOptionsGroup } from "~/models/full-options-group";
import { StringOptionsSelectComponent } from "~/tools/string-options-select/string-options-select.component";
import { QuantityModalComponent } from "~/tools/quantity-modal/quantity-modal.component";
import { Device, screen } from "tns-core-modules/platform";
import { on } from "tns-core-modules/application";
import { device } from "platform";
import { SocketListenService } from "~/services/socket-listen.service";
import { CartCategory } from "~/models/cart-category";
import { SelectedIndexChangedEventData, TabView } from "tns-core-modules/ui/tab-view";
import { AppConfig } from '~/models/app-config';
import { Orientation } from 'tns-core-modules/ui/layouts/stack-layout';


@Component({
  selector: "app-waiter",
  templateUrl: "./waiter.component.html",
  styleUrls: ["./waiter.component.scss"],
})
export class WaiterComponent implements OnInit, OnDestroy, AfterViewInit, AfterContentInit {
  cart: CartElement[] = [];
  cartGroups: CartGroup[] = [];
  appConfig: AppConfig
  groupIndexes: {} = {};

  menuElementsFull: MenuCategory[] = [];
  cartCategories: CartCategory[] = [];
  carts: Array<{ name: string; elements: MenuElement[] }> = [];

  tokenUser: TokenBase | null;
  total: number = 0;
  dishes: number = 0;
  subSEl: Subscription;
  subCart: Subscription;
  formCart: FormGroup;

  @ViewChild(RadSideDrawerComponent, { static: false })
  public drawerComponent: RadSideDrawerComponent;
  private drawer: RadSideDrawer;

  @ViewChild(TabView, { static: false }) tabViewComponent: TabView
  selectedIndex: number = 0

  drawerLocation: string = "Left";
  drawerContentSize: number = screen.mainScreen.widthDIPs <= 400 ? Math.ceil(screen.mainScreen.widthDIPs) : 400;
  timeInteval: Observable<number>;
  readyDate: Date;

  elementOptions: { desc: DescOptions[]; reverse: ReverseOptions[] };
  plusCartCategories: CartCategory[]
  actionType: OrderActionType = OrderActionType.onSite;
  actionTypesMap: Map<string, string> = new Map([
    [OrderActionTypeNames.onSite, OrderActionType.onSite],
    [OrderActionTypeNames.takeAway, OrderActionType.takeAway],
    [OrderActionTypeNames.delivery, OrderActionType.delivery],
  ]);
  addInProgress: boolean = false;
  isMenuDrawerOpened: boolean = false;
  menuHeight: number = Math.ceil(screen.mainScreen.heightDIPs) - 60;
  reservation: boolean = false
  reservationSize: number = 0
  onOnePlate: boolean = false
  buttonsBottomMenu: string = 'space-between'
  device: Device = device
  orient: Orientation
  creatingOrder: boolean = false
  subOrientChange: Subscription
  isInitView: boolean = true

  constructor(
    private page: Page,
    private activatedRoute: ActivatedRoute,
    private _changeDetectionRef: ChangeDetectorRef,
    private orderService: OrderService,
    private cartService: CartService,
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private messageService: MessageService,
    private viewContainerRef: ViewContainerRef,
    private modalService: ModalDialogService,
    private socketListenService: SocketListenService,
    private routerExtensions: RouterExtensions,
    private orientationChangeService: OrientationChangeService,
    private calculateService: CalculateService
  ) {
    this.page.actionBarHidden = true;
    let activity = application.android.startActivity;
    activity.getWindow().addFlags(android.view.View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN);

    this.tokenUser = this.activatedRoute.snapshot.data["user"];
    this.elementOptions = this.activatedRoute.snapshot.data["options"];
    this.plusCartCategories = this.activatedRoute.snapshot.data["plusCartCategories"]
    this.cartCategories = this.activatedRoute.snapshot.data["cartCategories"];
    this.menuElementsFull = this.activatedRoute.snapshot.data["menuElements"];
    this.appConfig = this.activatedRoute.snapshot.data["config"];
    this.drawerContentSize = screen.mainScreen.widthDIPs <= 400 ? Math.ceil(screen.mainScreen.widthDIPs) : 400;
    this.orient = (screen.mainScreen.heightDIPs > screen.mainScreen.widthDIPs) ? 'vertical' : 'horizontal'
  }


  ngOnInit(): void {
    this.prepareGroups();
    this.findGroupIndexes();
    this.createForm();
    this.subscribeToOrientChange()
    this.orientationChangeService.changeEmit()

    if (!this.socketListenService.connected) {
      this.socketListenService.startListen(this.tokenUser);
    }
  }

  subscribeToOrientChange() {
    this.subOrientChange = this.orientationChangeService.action$.subscribe((data: { orient: Orientation, deviceType: 'Phone' | 'Tablet', width?: number, height?: number }) => {
      // console.log(data)
      this.orient = data.orient
      if (!this.isInitView)
        this.changeMenuHeight(data.orient)
      this.changeViewPropsByScreenSize(data.width)

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

  changeViewPropsByScreenSize(w: number) {
    if (w > 1000) {
      this.buttonsBottomMenu = 'space-between'
    } else {
      this.buttonsBottomMenu = 'flex-start'
    }
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


  createForm() {
    this.formCart = this.fb.group({
      description: [""],
      forWho: [""],
      phone: [""],
      place: ["dowolne"],
    });
  }

  prepareGroups() {
    this.cartGroups = this.cartService.createCartGroups(this.cart, this.cartCategories);
  }

  findGroupIndexes() {
    this.cartGroups.map((g, i) => {
      this.groupIndexes[g.type.alias] = i;
    });
  }

  chooseTime() {
    var modal = new ModalPicker.ModalDatetimepicker();
    var options: ModalPicker.PickerOptions = { is24HourView: true }
    if (this.readyDate) {
      options.startingHour = this.readyDate.getHours()
      options.startingMinute = this.readyDate.getMinutes()
    }
    modal.pickTime(options).then((time) => {
      if (time) {
        this.readyDate = new Date();
        var m = moment(this.readyDate)
        m.hour(time.hour).minute(time.minute)
        // this.readyDate.setHours(time.hour);
        // this.readyDate.setMinutes(time.minute);
        this.readyDate = m.toDate()
      }
    });
  }

  chooseDay() {
    var modal = new ModalPicker.ModalDatetimepicker();
    var d: Date = new Date()
    if (this.readyDate)
      d = this.readyDate
    var m = moment(d)
    modal.pickDate({ startingDate: m.toDate() }).then((date) => {
      if (date) {
        if (!this.readyDate) {
          this.readyDate = new Date();
          m = moment()
        } else {
          var d: Date = Object.assign(this.readyDate)
          this.readyDate = new Date()
        }

        m.date(date.day).month(date.month - 1).year(date.year).hour(m.hour()).minute(m.minute())
        // this.readyDate.setDate(date.day);
        // this.readyDate.setMonth(date.month - 1);
        // this.readyDate.setFullYear(date.year);
        // this.readyDate.setHours(d.getHours() - 1);
        // this.readyDate.setMinutes(d.getMinutes());
        this.readyDate = m.toDate()

      }
    });
  }

  chooseAction() {


    if (this.actionType == OrderActionType.delivery || this.actionType == OrderActionType.takeAway) {
      this.actionType = OrderActionType.onSite
    } else {
      if (this.findIsSomePackElements()) {
        this.messageService.confirmMake("Zmiana ustawi opcję \"zapakować\" na wszystkich elementach.").then((bool) => {
          if (bool) {
            this.actionType = OrderActionType.takeAway
            this.changeActionForAllElements()
          }
        })
      } else {
        this.actionType = OrderActionType.takeAway
      }
    }

  }

  findIsSomePackElements(): boolean {
    var bool: boolean = false
    this.cart.map((el: CartElement, i: number) => {
      if (el.canPack) {
        bool = true
      }
    })
    return bool
  }


  changeActionForAllElements() {
    this.cart.map((el: CartElement, i: number) => {
      if (el.canPack) {
        this.cart[i].serveType = ServeType.pack
      }
    })
  }


  setTimeOrder(plusMinutes: number) {
    this.readyDate = moment().add(plusMinutes, "m").toDate();
  }

  plusMinutes() {
    const options: ModalDialogOptions = {
      context: {},
      viewContainerRef: this.viewContainerRef,
      fullscreen: false,
    };
    this.modalService.showModal(PlusTimeComponent, options).then((r) => {
      if (r)
        this.readyDate = moment().add(r, "minutes").toDate();
    });
  }

  makeReservation() {
    var data: { description: string, forWho: string, phone: string, reservationSize: number } = {
      description: this.formCart.get("description").value,
      forWho: this.formCart.get("forWho").value,
      phone: this.formCart.get("phone").value,
      reservationSize: this.reservationSize
    }
    this.cartService.showModalReservation(this.viewContainerRef, this.readyDate, data).then(r => {
      if (r) {
        this.readyDate = r.readyDate
        this.reservation = true
        this.reservationSize = r.size
        this.formCart.get('description').setValue(r.description)
        this.formCart.get('forWho').setValue(r.forWho)
        this.formCart.get('phone').setValue(r.phone)
      } else {
        this.reservation = false
        this.reservationSize = 0
        // this.formCart.get('description').setValue('')
        // this.formCart.get('forWho').setValue('')
      }
    })
  }


  setEditInfo() {
    this.cartService.showModalReservationData(this.viewContainerRef, {
      reservationSize: 0,
      description: this.formCart.get("description").value,
      phone: this.formCart.get("phone").value,
      forWho: this.formCart.get("forWho").value,
    }, true).then((data: boolean | { description: string, forWho: string, phone: string, reservationSize: number }) => {
      if (data) {
        let d: { description: string, forWho: string, phone: string, reservationSize: number } = <{ description: string, forWho: string, phone: string, reservationSize: number }>data
        this.formCart.get("description").setValue(d.description)
        this.formCart.get("phone").setValue(d.phone)
        this.formCart.get("forWho").setValue(d.forWho)
      }
    })
  }


  clearTime() {
    this.readyDate = undefined;
    this.reservation = false
    this.reservationSize = 0
  }

  clearCart() {
    this.total = 0;
    this.dishes = 0;
    this.cart = [];
    this.cartGroups = [];
    this.prepareGroups();
    this.findGroupIndexes();
    this.readyDate = undefined;
    this.actionType = OrderActionType.onSite;
  }

  clearFromButton() {
    this.messageService.confirmMake("Czy chcesz oczyścić koszyk?").then((bool) => {
      if (bool) {
        this.clearCart();
      }
    });
  }


  setOnePlate() {
    if (this.onOnePlate) {
      this.onOnePlate = false
    } else {
      if (this.findIsSomeOnePlateElements()) {
        this.messageService.confirmMake("Zmiana ustawi opcję \"na jednym talerzu\" na wszystkich elementach.").then((bool) => {
          if (bool) {
            this.onOnePlate = true
            this.changeAllOnOnePlate()
          }
        })
      } else {
        this.onOnePlate = true
      }
    }
  }


  findIsSomeOnePlateElements(): boolean {
    var bool: boolean = false
    this.cart.map((el: CartElement, i: number) => {
      if (el.canOnePlate) {
        bool = true
      }
    })
    return bool
  }


  changeAllOnOnePlate() {
    this.cart.map((c: CartElement, i: number) => {
      if (c.canOnePlate) {
        this.cart[i].onOnePlate = true
      }
    })
  }


  changeAllOnManyPlates() {
    this.cart.map((c: CartElement, i: number) => {
      if (c.canOnePlate) {
        this.cart[i].onOnePlate = false
      }
    })
  }


  openDrawer(position: "Left" | "Right") {
    this.drawerLocation = position;
    setTimeout(() => {
      this.drawer.showDrawer();
    });
  }

  openMenuDrawer(position: "Left" | "Right") {
    this.openDrawer(position);
  }

  closeDrawer() {
    this.drawer.closeDrawer();
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


  addSpecial() {
    var options: ModalDialogOptions = {
      context: {
        elementOptions: this.elementOptions,
        appConfig: this.appConfig,
        onOnePlate: this.onOnePlate,
        orderActionType: this.actionType
      },
      viewContainerRef: this.viewContainerRef,
      fullscreen: true,
    };
    this.modalService.showModal(SpecialElementComponent, options).then((r: { isOptions: true, data: FullOptionsGroup, price: string }) => {

      if (r) {
        this.isInitView = true
        var cartEl: CartElement = this.cartService.createCartSpecialElement(r.data, this.cartCategories, r.price)
        this.cartPushSpecial(cartEl)
        this.cartSum();
      }

    });
  }

  cartPushSpecial(cartEl: CartElement) {
    cartEl.specialInd = this.cart.length
    this.cart.push(cartEl);
    this.putElementToGroup(cartEl.type, cartEl);
  }


  addToCart(data: { element: MenuElement; index: number; priceNameIndex: number | null; boolean; asSimple?: boolean }) {
    this.addInProgress = true;
    // this.isInitView = true
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
      this.onOnePlate,
      this.actionType
    ).then((r: FullOptionsGroup | boolean) => {
      if (r) {
        var cartEl: CartElement = this.cartService.createCartElement(element, <FullOptionsGroup>r, type);
        // console.log(cartEl.plusElements)
        this.cartUpdatePush(cartEl);
        return true;
      } else {
        return false;
      }
    })

  }



  findIsElementInCart(cartEl: CartElement): { bool: boolean; cartIndex: number | null } {
    var bool: boolean = false;
    var cartIndex: number | null = null;

    this.cart.map((el, i) => {
      if (el.elementType != "special") {
        if (el.ind.id == cartEl.element.id && el.ind.index == cartEl.ind.index) {
          bool = true;
          cartIndex = i;
        }
      }
    });

    return { bool, cartIndex };
  }

  cartUpdatePush(cartEl: CartElement) {

    this.cart.push(cartEl);
    this.putElementToGroup(cartEl.type, cartEl);

  }



  updateCart(data: { cartEl: CartElement, index: number }) {
    if (data.cartEl.elementType == "special") {
      var index: number = data.cartEl.specialInd
      this.cart[index] = data.cartEl;
      this.cartGroups.map((cg, i) => {
        if (cg.type.isSpecial) {
          this.cartGroups[i].elements[data.index].description = data.cartEl.description
          this.cartGroups[i].elements[data.index].quantity = data.cartEl.quantity
        }
      })
      this.cartSum();
    } else {
      var index: number = this.cartService.findElementIndex(this.cart, data.cartEl);
      this.cart[index] = data.cartEl;
      this.findInGroupAndUpdate(data.cartEl.type, data.cartEl);
      this.cartSum();
    }

  }

  remove(data: { cartEl: CartElement, index: number }) {
    var { cartEl, index } = data
    if (cartEl.type.isSpecial) {
      this.cart.splice(cartEl.specialInd, 1);
      this.cartGroups.map((cg, i) => {
        if (cg.type.isSpecial) {
          this.cartGroups[i].elements.splice(index, 1)
        }
      })
    } else {
      var index: number = this.cartService.findElementIndex(this.cart, cartEl);
      this.cart.splice(index, 1);
      var i: number = this.groupIndexes[cartEl.type.alias];
      this.cartGroups[i].elements.map((el, j) => {
        if (el.ind.id == cartEl.ind.id && el.ind.index == cartEl.ind.index) {
          this.cartGroups[i].elements.splice(j, 1);
        }
      });
    }

    this.cartSum();
  }




  putElementToGroupUpdateQuantity(anchor: CartCategory, cartEl: CartElement) {
    var i: number = this.groupIndexes[anchor.alias];
    this.cartGroups[i].elements.map((el, j) => {
      if (cartEl.ind) {
        if (el.ind.id == cartEl.ind.id && el.ind.index == cartEl.ind.index) {
          this.cartGroups[i].elements[j].quantity = cartEl.quantity;
          this.cartGroups[i].elements[j].price = cartEl.price;
        }
      }
    });
  }

  putElementToGroup(anchor: CartCategory, cartEl: CartElement) {
    var i: number = this.groupIndexes[anchor.alias];
    this.cartGroups[i].elements.push(cartEl);
  }

  findInGroupAndUpdate(anchor: CartCategory, cartEl: CartElement) {
    this.cartGroups.map((g, i) => {
      if (g.type.alias == anchor.alias) {
        g.elements.map((el, j) => {
          if (cartEl.ind) {
            if (el.ind.id == cartEl.ind.id && el.ind.index == cartEl.ind.index) {
              this.cartGroups[i].elements[j].quantity = cartEl.quantity;
              this.cartGroups[i].elements[j].description = cartEl.description;
            }
          }
        });
      }
    });
  }

  gotToReserve() {
    var day = moment(new Date()).format("yy-MM-DD");
    this.routerExtensions.navigate(['/reservations'], { queryParams: { backTo: 'home', day } })
  }


  cartSum() {
    var ps: Array<string | number> = []
    this.cart.map((cel: CartElement) => {
      ps.push(cel.price)
    });
    this.total = this.calculateService.pricePlusMapElements(0, ps)
    this.dishes = 0;
    this.cart.map((cel) => {
      this.dishes += cel.quantity;
    });
  }

  submit() {
    var isTypesCountOk: boolean = true
    var cartElements: CartElement[] = []
    this.cart.map((cartEl: CartElement) => {
      if (cartEl.elementType != ElementType.special) {
        if (cartEl.element.optionsOnInit == 'select' || cartEl.element.optionsOnInit == 'all' || cartEl.element.optionsOnInit == 'custom') {
          if (cartEl.element.options.length > 0) {
            if (cartEl.quantity != cartEl.optionsElements.length) {
              isTypesCountOk = false
              cartElements.push(cartEl)
            }
          }
        }
      }
    })

    if (!isTypesCountOk) {
      var stringElements: string = '('
      cartElements.map((el, i) => {
        stringElements += el.shortName
        if (i != (cartElements.length - 1)) {
          stringElements += ', '
        }
      })
      stringElements += ')'
      this.messageService.showAlert("Nie odpowiednia liczba rodzajów elementu(ów) " + stringElements);
      return;
    }

    var afterMin: boolean = false;
    var ready: Date = this.readyDate;
    var plusMinutes = moment().add(moment.duration(PLUS_MINUTES, "minutes"));

    if (!this.readyDate) {
      this.messageService.showAlert("Ustaw czas dla zamówienia.");
      return;
    }

    if (this.cart.length == 0 && !this.reservation) {
      this.messageService.showAlert("Zamówienie nie może być puste lub nie zostało oznaczone jako rezerwacja.");
      return;
    }

    if (moment(ready).isAfter(plusMinutes)) {
      afterMin = true;
    } else {
      afterMin = false;
      this.messageService.showAlert("Czas nie przekracza 5 min.");
      return;
    }



    if (((this.cart.length > 0) && afterMin) || (afterMin && this.reservation)) {
      this.creatingOrder = true
      this.orderService.createOrder(
        this.cart, this.total,
        this.formCart.get("description").value,
        this.formCart.get("forWho").value,
        this.formCart.get("phone").value,
        this.formCart.get("place").value,
        this.actionType,
        this.tokenUser.user.id,
        new Date(),
        this.readyDate,
        this.reservation,
        this.reservationSize,
        this.onOnePlate
      ).then((r) => {
        this.creatingOrder = false
        this.clearCart();
      });
    }
  }

  logOut() {
    this.authService.logOut().then((r) => {
      this.router.navigate(["/login"]);
    });
  }

  ngOnDestroy() {
    if (this.subSEl) this.subSEl.unsubscribe();
    if (this.subCart) this.subCart.unsubscribe();
    if (this.subOrientChange) this.subOrientChange.unsubscribe()
  }
}
