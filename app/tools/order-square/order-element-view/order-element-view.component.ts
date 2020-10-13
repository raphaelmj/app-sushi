import { CartOrder } from '~/models/cart-order';
import { Component, OnInit, Input } from '@angular/core';
import { CartElement, PlusElement } from '~/models/cart-element';
import { OrderService } from '~/services/orders/order.service';

@Component({
  selector: 'app-order-element-view',
  templateUrl: './order-element-view.component.html',
  styleUrls: ['./order-element-view.component.scss']
})
export class OrderElementViewComponent implements OnInit {

  @Input() element: CartElement
  @Input() order: CartOrder
  changeInProgress: boolean = false
  isPlusGrill: boolean = false

  constructor(private orderService: OrderService) { }

  ngOnInit(): void {
    this.isPlusGrill = this.checkIsSomePlusGrill()
  }

  changeStatus() {
    var nStatus: boolean = !this.element.status
    this.element.status = nStatus
    this.changeInProgress = true
    this.orderService.changeElementStatus(nStatus, this.element.id).then(r => {
      this.changeInProgress = false
    })
  }

  checkIsSomePlusGrill(): boolean {
    var bool = false
    if (this.element.plusElements) {
      this.element.plusElements.map((pl: PlusElement) => {
        if (pl.grill > 0) {
          bool = true
        }
      })
    }
    return bool
  }

}
