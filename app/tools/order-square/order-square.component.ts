import { AppConfig } from '~/models/app-config';
import { OrderElementStatusChangeRefreshService } from '~/services/order-element-status-change-refresh.service';
import { ConfirmPasswordType } from '~/tools/password-confirm/password-confirm.component';
import { CartService } from '~/services/cart.service';
import { BonusType, DatePosition } from './../../models/cart-order';
import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  OnDestroy,
  OnChanges,
  ViewContainerRef,
  SimpleChanges,
  ChangeDetectorRef,
} from "@angular/core";
import {
  CartOrder,
  OrderActionTypeNames,
  OrderActionType,
  OrderStatusName,
  OrderStatus,
} from "~/models/cart-order";
import { interval, Subscription } from "rxjs";
import * as ModalPicker from "nativescript-modal-datetimepicker";
import * as moment from "moment";
require("moment-precise-range-plugin");
import { OrderService } from "~/services/orders/order.service";
import { action } from "tns-core-modules/ui/dialogs";
import { Router } from "@angular/router";
import { RefreshOrdersService } from "~/services/refresh-orders.service";
import { Time } from "@angular/common";
import { DateDiff } from "~/models/date-diff";
import { ModalDialogService, ModalDialogOptions, RouterExtensions } from "@nativescript/angular";
import { PlusTimeComponent } from "../plus-time/plus-time.component";
import { isNull } from 'util';
import { BonusResponseData } from '../bonus-set-config/bonus-set-config.component';

@Component({
  selector: "app-order-square",
  templateUrl: "./order-square.component.html",
  styleUrls: ["./order-square.component.scss"],
})
export class OrderSquareComponent implements OnInit, OnChanges, OnDestroy {
  @Output() emitStatus: EventEmitter<{
    status: string;
    id: number;
  }> = new EventEmitter<{ status: string; id: number }>();
  @Input() order: CartOrder;
  @Input() day: Date;
  @Input() appConfig: AppConfig;
  actionTypes: Map<string, string> = new Map([
    [OrderActionTypeNames.onSite, OrderActionType.onSite],
    [OrderActionTypeNames.takeAway, OrderActionType.takeAway],
  ]);

  statuses: Map<string, string> = new Map([
    [OrderStatusName.create, OrderStatus.create],
    [OrderStatusName.ready, OrderStatus.ready],
    [OrderStatusName.archive, OrderStatus.archive],
  ]);


  hidden: boolean = false;
  subInterval: Subscription;
  subStatusChange: Subscription
  diff: DateDiff;

  datePosition: DatePosition

  rowsSquare: string = '30,30,auto,40'
  isOrderInfoEmpty: boolean = true

  constructor(
    private orderService: OrderService,
    private router: Router,
    private routerExtensions: RouterExtensions,
    private refreshOrdersService: RefreshOrdersService,
    private modalService: ModalDialogService,
    private viewContainerRef: ViewContainerRef,
    private cartService: CartService,
    private _changeDetectionRef: ChangeDetectorRef,
    private orderElementStatusChangeRefreshService: OrderElementStatusChangeRefreshService
  ) { }


  ngOnInit(): void {
    this.createTimeLimit();
    this.subToInterval();
    this.subscribeStatusChange()
    this.findDayPos()
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.order) {
      var order: CartOrder = changes.order.currentValue
      this.rowsSquare = (order.reservation) ? '30,30,30,auto,auto,40' : '30,30,auto,auto,40'
      this.isOrderInfoEmpty = this.checkIsOrderInfoEmpty(order)
      if (!changes.order.firstChange)
        this._changeDetectionRef.detectChanges()
    }
  }

  checkIsOrderInfoEmpty(order: CartOrder): boolean {
    return (order.description == '' && order.forWho == '' && (order.phone == '' || isNull(order.phone)))
  }

  subToInterval() {
    this.subInterval = interval(1000).subscribe((n) => {
      this.createTimeLimit();
    });
  }

  subscribeStatusChange() {
    this.subStatusChange = this.orderElementStatusChangeRefreshService.action$.subscribe(o => {
      // console.log(o.orderId)
      if (o.orderId == this.order.id) {
        this.order.cartOrderElements.map((el, i) => {
          if (el.id == o.elementId) {
            this.order.cartOrderElements[i].status = o.status
          }
        })
      }
    })
  }

  createTimeLimit() {
    var currentDate = moment(new Date());
    var endDate = moment(new Date(this.order.endAt));
    this.diff = moment.preciseDiff(currentDate, endDate, true);
  }

  changeResSize() {
    this.cartService.showModalReservationSize(this.viewContainerRef, this.order.reservationSize).then((data: boolean | number) => {
      if (data) {
        this.orderService.changeOrderField('reservationSize', data, this.order.id).then(r => {
          this.order.reservationSize = <number>data
        })
      }
    })
  }


  changeReservationData() {
    this.cartService.showModalReservationData(this.viewContainerRef, {
      reservationSize: this.order.reservationSize,
      description: this.order.description,
      phone: this.order.phone,
      forWho: this.order.forWho,
    }, !this.order.reservation).then((data: boolean | { description: string, forWho: string, phone: string, reservationSize: number }) => {
      if (data) {
        // console.log(order)
        this.orderService.changeOrderFields(data, this.order.id).then(r => {
          this.refreshOrdersService.makeRefresh()
        })
      }
    })
  }

  changeReservation() {
    let options = {
      title: "Rezewacja",
      message: "",
      cancelButtonText: "Anuluj",
      actions: [
        'Rezerwacja',
        'Przyjęte na miejscu'
      ],
    };

    action(options).then((result: string) => {
      if (result != "Anuluj") {
        switch (result) {
          case 'Rezerwacja':
            this.orderService.changeOrderField('reservation', true, this.order.id).then(r => {
              this.order.reservation = true
            })
            break;
          case 'Przyjęte na miejscu':
            this.orderService.changeOrderField('reservation', false, this.order.id).then(r => {
              this.order.reservation = false
            })
            break;
        }
      };
    });
  }

  findDayPos() {
    var currentDay = moment(moment(this.day).format('YYYY-MM-DD'));
    var orderDay = moment(this.order.endDay)
    if (orderDay.isBefore(currentDay)) {
      this.datePosition = DatePosition.before
    } else if (orderDay.isAfter(currentDay)) {
      this.datePosition = DatePosition.after
    } else if (orderDay.isSame(currentDay)) {
      this.datePosition = DatePosition.now
    }
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

  changeDate() {
    var endDate: Date = new Date(this.order.endAt);
    var modal = new ModalPicker.ModalDatetimepicker();
    var m = moment(endDate)
    modal
      .pickDate({ startingDate: m.toDate(), datePickerMode: "spinner" })
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

  changeActionType() {
    let options = {
      title: "Typ zamówienia",
      message: "wybierz typ",
      cancelButtonText: "Anuluj",
      actions: [OrderActionTypeNames.onSite, OrderActionTypeNames.takeAway],
    };

    action(options).then((result: string) => {
      if (result != "Anuluj") {
        var type: OrderActionType = <OrderActionType>(
          this.actionTypes.get(result)
        );
        this.orderService
          .changeOrderField("actionType", type, this.order.id)
          .then((r) => {
            this.order.actionType = type;
          });
      }
    });
  }

  changeStatus() {
    let options = {
      title: "Status zamówienia",
      message: "",
      cancelButtonText: "Anuluj",
      actions: [
        OrderStatusName.create,
        OrderStatusName.ready,
        OrderStatusName.archive,
      ],
    };

    action(options).then((result: string) => {
      if (result != "Anuluj") {
        var sts: OrderStatus = <OrderStatus>this.statuses.get(result);
        this.orderService.changeOrderStatus(sts, this.order.id).then((r) => {
          this.order.status = sts;
          // this.refreshOrdersService.makeRefresh()
        });
      }
    });
  }


  changeInProgress() {
    let inProgress: boolean = (this.order.inProgress) ? false : true
    this.orderService.changeOrderField('inProgress', inProgress, this.order.id).then(r => {
      this.order.inProgress = inProgress
    })
  }


  setAsReady() {
    var s: OrderStatus = OrderStatus.ready;
    if (this.order.status == OrderStatus.ready) {
      s = OrderStatus.create
    }
    this.orderService.changeOrderStatus(s, this.order.id).then((r) => {
      this.order.status = OrderStatus.ready;
      // this.refreshOrdersService.makeRefresh()
    });
  }

  setPaid() {
    var paid: boolean = (this.order.paid) ? false : true
    this.orderService.changeOrderField('paid', paid, this.order.id).then(r => {
      this.order.paid = paid
    })
  }


  setBonus() {

    // this.cartService.showModalCheckSomePassword(this.viewContainerRef, ConfirmPasswordType.imageCode).then(bool => {
    //   if (bool) {
    //     var ub: boolean = (this.order.bonusUsed) ? false : true
    //     this.orderService.bonusSetUnset(this.order.id, ub).then((o: CartOrder) => {
    //       this.order = { ...this.order, ...{ bonusUsed: o.bonusUsed, bonusTotal: o.bonusTotal, paid: o.paid } }
    //     })
    //   }
    // })
    // if (this.order.bonusUsed) {

    this.cartService.showModalBonusConfig(
      this.viewContainerRef,
      this.order.total,
      this.appConfig,
      this.order.bonusType,
      this.order.currentBonusPrice,
      this.order.currentBonusPercent).then((r: BonusResponseData | boolean) => {
        if (r) {

          var bonusData: BonusResponseData = <BonusResponseData>r
          var bonusUsed: boolean = (bonusData.bonusType == BonusType.none) ? false : true
          this.orderService.bonusTypeSetUnset(this.order.id, bonusUsed, bonusData.bonusType, bonusData.currentBonusPercent).then((o: CartOrder) => {
            this.order = { ...this.order, ...{ bonusUsed: o.bonusUsed, bonusTotal: o.bonusTotal, paid: o.paid, bonusType: o.bonusType } }
          })
        }
      })

    // } else {
    //   this.cartService.showModalBonusConfig(
    //     this.viewContainerRef,
    //     this.order.total,
    //     this.appConfig,
    //     this.order.bonusType,
    //     this.order.currentBonusPrice,
    //     this.order.currentBonusPercent).then((r: BonusResponseData | boolean) => {
    //       if (r) {
    //         var bonusData: BonusResponseData = <BonusResponseData>r
    //         this.orderService.bonusTypeSetUnset(this.order.id, true, bonusData.bonusType, bonusData.currentBonusPercent).then((o: CartOrder) => {
    //           this.order = { ...this.order, ...{ bonusUsed: o.bonusUsed, bonusTotal: o.bonusTotal, paid: o.paid, bonusType: o.bonusType } }
    //         })
    //       }
    //     })
    // }


  }

  plusMinutes() {
    const options: ModalDialogOptions = {
      context: {},
      viewContainerRef: this.viewContainerRef,
      fullscreen: false,
    };
    this.modalService.showModal(PlusTimeComponent, options).then((r) => {
      // console.log(r)
      if (r) {
        var endAt: Date = new Date(this.order.endAt);
        this.order.endAt = moment(endAt).add(r, "minutes").toDate();
        this.orderService
          .changeOrderDate(this.order.endAt, this.order.id)
          .then((r) => {
            // this.refreshOrdersService.makeRefresh()
          });
      }
    });
  }

  toArchive() {
    var status: OrderStatus = OrderStatus.archive;
    if (this.order.status == OrderStatus.archive) {
      status = OrderStatus.create;
    }
    this.orderService.changeOrderStatus(status, this.order.id).then((r) => {
      this.order.status = status;
      this.refreshOrdersService.makeRefresh()
    });
  }

  goToEdit() {
    // this.router.navigate(["/order/" + this.order.id]);
    this.routerExtensions.navigate(["/order/" + this.order.id], { clearHistory: true });
  }

  hide() {
    this.hidden = this.hidden ? false : true;
  }

  ngOnDestroy(): void {
    if (this.subInterval) this.subInterval.unsubscribe();
    if (this.subStatusChange) this.subStatusChange.unsubscribe()
  }
}
