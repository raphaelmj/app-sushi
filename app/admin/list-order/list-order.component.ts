import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { CartOrder, OrderStatus } from '~/models/cart-order';
import { action, confirm } from "tns-core-modules/ui/dialogs"
import { Router } from '@angular/router';
import { OrderService } from '~/services/orders/order.service';
import { Subscription } from 'rxjs';
import { CartGroup } from '~/models/cart-element';

@Component({
  selector: 'app-list-order',
  templateUrl: './list-order.component.html',
  styleUrls: ['./list-order.component.scss']
})
export class ListOrderComponent implements OnInit, OnDestroy {

  @Output() emitStatus: EventEmitter<{ status: string, id: number }> = new EventEmitter<{ status: string, id: number }>()
  @Input() order: CartOrder
  orderSts: Map<string, string> = new Map()
  subOrder: Subscription
  isOrderDetails: boolean = false
  details: { order: CartOrder, group: CartGroup[] }

  constructor(private router: Router, private orderService: OrderService) { }


  ngOnInit(): void {
    // console.log(this.order)
    this.initMap()
  }

  initMap() {

    this.orderSts.set("Oznacz jak nowy", 'create')
    this.orderSts.set("Oczekujący", 'touched')
    this.orderSts.set("W trakcie", 'inprogress')
    this.orderSts.set("Gotowe", 'ready')
  }

  changeStatus() {
    let options = {
      title: "Status zamówienia",
      message: "Choose your race",
      cancelButtonText: "Anuluj",
      actions: ['Oznacz jak nowy', 'Oczekujący', 'W trakcie', 'Gotowe']
    };

    action(options).then((result: string) => {
      if (result != 'Anuluj') {
        // console.log(result)
        let status: OrderStatus = <OrderStatus>this.orderSts.get(result)
        this.emitStatus.emit({ status, id: this.order.id })
        this.order.status = status
      }
    });
  }

  toArchive() {
    let options = {
      title: "Archiwizacja",
      message: "Czy checesz przenieść zamówienie do archiwum",
      okButtonText: "Tak",
      cancelButtonText: "Nie",
      neutralButtonText: "Anuluj"
    };

    confirm(options).then((result: boolean) => {
      if (result) {
        this.emitStatus.emit({ status: "archive", id: this.order.id })
      }
    });
  }


  showDetails() {
    this.router.navigate(['/admin/order/' + this.order.id])
  }

  showShortDetails() {
    if (this.isOrderDetails) {
      this.isOrderDetails = false
      this.details = null
    } else {
      this.subOrder = this.orderService.getOrder(this.order.id).subscribe(data => {
        this.isOrderDetails = true
        this.details = data
      })
    }

  }

  ngOnDestroy(): void {
    if (this.subOrder)
      this.subOrder.unsubscribe()
  }

}
