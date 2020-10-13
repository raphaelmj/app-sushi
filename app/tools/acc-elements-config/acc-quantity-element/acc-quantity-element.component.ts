import { AccElement, AccType } from './../../../models/cart-element';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-acc-quantity-element',
  templateUrl: './acc-quantity-element.component.html',
  styleUrls: ['./acc-quantity-element.component.scss']
})
export class AccQuantityElementComponent implements OnInit {

  @Output() emitChange: EventEmitter<{ howMany: number, index: number, acc: AccType }> = new EventEmitter<{ howMany: number, index: number, acc: AccType }>()
  @Input() acc: AccElement
  @Input() index: number
  min: number = -1

  constructor() { }

  ngOnInit(): void {
  }

  change(action: 'plus' | 'minus') {
    switch (action) {
      case "plus":
        this.acc.howMany++
        break;
      case "minus":
        if (this.acc.howMany > this.min) {
          this.acc.howMany--
        }
        break;
    }
    this.emitChange.emit({ howMany: this.acc.howMany, index: this.index, acc: this.acc.acc })
  }

}
