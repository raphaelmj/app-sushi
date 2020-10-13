import { EventEmitter } from '@angular/core';
import { Orientation } from 'tns-core-modules/ui/layouts/stack-layout';
import { ChangeDetectorRef, OnDestroy, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { OrientationChangeService } from './../../../services/orientation-change.service';
import { ElementType } from './../../../models/cart-element';
import { PlusElement } from '~/models/cart-element';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-plus-elements-cart-view',
  templateUrl: './plus-elements-cart-view.component.html',
  styleUrls: ['./plus-elements-cart-view.component.scss']
})
export class PlusElementsCartViewComponent implements OnInit, OnDestroy {

  @Output() emitRemoveElement: EventEmitter<number> = new EventEmitter<number>()
  @Output() emitRemovePlusStep: EventEmitter<{ i: number, j: number }> = new EventEmitter<{ i: number, j: number }>()
  @Output() emitRemovePlusOptions: EventEmitter<{ i: number, j: number }> = new EventEmitter<{ i: number, j: number }>()
  @Input() plusElements: PlusElement[]
  elementType = ElementType

  subOrientChange: Subscription
  widthOptionsSteps: string = '33.33%'
  stepConfigListWidth: string = '75%'
  stepConfigPriceWidth: string = '25%'
  widthNormalPlus: string = '50%'

  constructor(
    private orientationChangeService: OrientationChangeService,
    private _changeDetectionRef: ChangeDetectorRef
  ) { }


  ngOnInit(): void {
    this.subscribeToOrientChange()
    this.orientationChangeService.changeEmit()
  }


  subscribeToOrientChange() {
    this.subOrientChange = this.orientationChangeService.action$.subscribe((data: { orient: Orientation, deviceType: 'Phone' | 'Tablet', width?: number, height?: number }) => {
      switch (data.orient) {
        case "horizontal":
          this.setOptionsStepsWidth(data.width)
          break;
        case "vertical":
          this.setOptionsStepsWidth(data.height)
          break;
      }

      this._changeDetectionRef.detectChanges()
    })
  }

  setOptionsStepsWidth(w: number) {
    if (w > 1000) {
      this.widthOptionsSteps = '33.33%'
      this.stepConfigListWidth = '75%'
      this.stepConfigPriceWidth = '25%'
      this.widthNormalPlus = '50%'
    } else if (w <= 1000 && w > 600) {
      this.widthOptionsSteps = '50%'
      this.stepConfigListWidth = '50%'
      this.stepConfigPriceWidth = '50%'
      this.widthNormalPlus = '50%'
    } else {
      this.widthOptionsSteps = '100%'
      this.stepConfigListWidth = '100%'
      this.stepConfigPriceWidth = '100%'
      this.widthNormalPlus = '100%'
    }
  }

  removePlusEl(i: number) {
    // var el: PlusElement = this.cartEl.plusElements[i];
    // this.cartEl.plusElements.splice(i, 1);
    // this.cartEl.price = this.calculateService.minusElements(this.cartEl.price, el.price);
    // this.emitChange.emit({ cartEl: this.cartEl, date: new Date(), index: this.offsetIndex });
    this.emitRemoveElement.emit(i)
  }

  removePlusStep(i: number, j: number) {
    // this.cartEl.plusElements[i].stepOptionsList.splice(j, 1)
    // if (this.cartEl.plusElements[i].stepOptionsList.length == 0) {
    //   this.cartEl.plusElements.splice(i, 1)
    //   this.priceChange();
    //   this.emitChange.emit({ cartEl: this.cartEl, date: new Date(), index: this.offsetIndex });
    //   return
    // }
    // var ps: Array<number | string> = []
    // this.cartEl.plusElements[i].stepOptionsList.map(p => {
    //   ps.push(p.pricePerOne)
    // })
    // let price: number = this.calculateService.pricePlusMapElements(0, ps)
    // this.cartEl.plusElements[i].price = price
    // this.cartEl.plusElements[i].pricePerOne = price
    // this.priceChange();
    // this.emitChange.emit({ cartEl: this.cartEl, date: new Date(), index: this.offsetIndex });
    this.emitRemovePlusStep.emit({ i, j })
  }


  removePlusOption(i: number, j: number) {
    // if (this.cartEl.plusElements[i].qunatity == 1) {
    //   this.cartEl.plusElements.splice(i, 1)
    //   this.priceChange();
    //   this.emitChange.emit({ cartEl: this.cartEl, date: new Date(), index: this.offsetIndex });
    //   return;
    // }
    // this.cartEl.plusElements[i].qunatity--
    // this.cartEl.plusElements[i].price = this.calculateService.multipleQuantity(this.cartEl.plusElements[i].qunatity, this.cartEl.plusElements[i].pricePerOne)
    // this.cartEl.plusElements[i].optionsElements.splice(j, 1)
    // this.priceChange();
    // this.emitChange.emit({ cartEl: this.cartEl, date: new Date(), index: this.offsetIndex });
    this.emitRemovePlusOptions.emit({ i, j })
  }

  ngOnDestroy(): void {
    if (this.subOrientChange) this.subOrientChange.unsubscribe()
  }

}
