import { OrderService } from '~/services/orders/order.service';
import { CartService } from '~/services/cart.service';
import { MessageService } from '~/services/message.service';
import { CartOrder, DatePosition, OrderStatus, OrderStatusName } from '~/models/cart-order';
import { ChangeDetectorRef, Component, Input, OnInit, Output, ViewContainerRef, EventEmitter } from '@angular/core';
import { screen } from "tns-core-modules/platform";
import { on } from "tns-core-modules/application";
import { RouterExtensions } from '@nativescript/angular';
import { ConfirmPasswordType } from '~/tools/password-confirm/password-confirm.component';
import * as moment from "moment";
import { action } from "tns-core-modules/ui/dialogs";

@Component({
  selector: 'app-reservation-row',
  templateUrl: './reservation-row.component.html',
  styleUrls: ['./reservation-row.component.scss']
})
export class ReservationRowComponent implements OnInit {

  @Input() order: CartOrder
  @Input() day: Date
  @Input() datePosition: DatePosition
  @Output() emitChange: EventEmitter<any> = new EventEmitter<any>()
  @Output() routeChange: EventEmitter<any> = new EventEmitter<any>()
  width: string
  statuses: Map<string, string> = new Map([
    [OrderStatusName.create, OrderStatus.create],
    [OrderStatusName.ready, OrderStatus.ready],
    [OrderStatusName.archive, OrderStatus.archive],
  ]);

  constructor(
    private _changeDetectionRef: ChangeDetectorRef,
    private routerExtensions: RouterExtensions,
    private messageService: MessageService,
    private cartService: CartService,
    private viewContainerRef: ViewContainerRef,
    private orderService: OrderService
  ) {
    if (screen.mainScreen.widthDIPs > 1000) {
      this.width = '50%'
    } else {
      this.width = '100%'
    }
  }

  ngOnInit(): void {

    this.changeOrientationObserve()
  }

  changeOrientationObserve() {
    on("orientationChanged", (evt) => {
      switch (evt.newValue) {
        case "landscape":
          if (screen.mainScreen.heightDIPs > 1000) {
            this.width = '50%'
          } else {
            this.width = '100%'
          }
          break;
        case "portrait":
          this.width = '100%'
          break;
      }
      this._changeDetectionRef.detectChanges()
    });
  }

  goToEdit() {
    this.routeChange.emit()
    this.routerExtensions.navigate(['/order/' + this.order.id], { clearHistory: true })
  }

  removeReservation() {
    this.messageService.confirmMake('Czy chcesz usunąć rezerwacje?').then(bool => {
      if (bool) {
        this.cartService.showModalCheckSomePassword(this.viewContainerRef, ConfirmPasswordType.imageCode).then(bool => {
          if (bool) {
            this.orderService.removeOrder(this.order.id).then(r => {
              this.emitChange.emit()
            })
          }
        })
      }
    })
  }




  openEdit() {
    var d: Date = moment(this.order.endAt).toDate()
    this.cartService.showModalReservation(
      this.viewContainerRef,
      d,
      { description: this.order.description, forWho: this.order.forWho, phone: this.order.phone, reservationSize: this.order.reservationSize },
      false
    ).then((r: { readyDate: Date, size: number, description: string, forWho: string, phone: string } | boolean) => {
      if (r) {
        r = <{ readyDate: Date, size: number, description: string, forWho: string, phone: string }>r
        r['reservationSize'] = r['size']
        r['endAt'] = moment(r.readyDate).toDate()
        r['endDay'] = moment(r.readyDate).format("yyyy-MM-DD");
        var { size, readyDate, ...rest } = <{ readyDate: Date, size: number, description: string, phone: string, forWho: string, reservationSize: number, endAt: Date, endDay: string }>r

        this.orderService.changeOrderFields(rest, this.order.id).then(res => {
          this.order = { ...this.order, ...rest }
          this.emitChange.emit()
        })
      }
    })
  }


  archiveReservation() {
    this.messageService.confirmMake('Czy checesz przenieść rezerwację do archiwum?').then(bool => {
      if (bool) {
        this.orderService.changeOrderStatus(OrderStatus.archive, this.order.id).then(r => {
          this.emitChange.emit()
        })
      }
    })
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
          this.emitChange.emit()
        });
      }
    });
  }

  changePaid() {
    var paid: boolean = (this.order.paid) ? false : true
    this.orderService.changeOrderField('paid', paid, this.order.id).then(r => {
      this.order.paid = paid
      this.emitChange.emit()
    })
  }

}
