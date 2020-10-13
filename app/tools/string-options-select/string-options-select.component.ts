import { OrderActionType } from '~/models/cart-order';
import { AppConfig } from '~/models/app-config';
import { CartService } from '~/services/cart.service';
import { ServeType, AccElement } from './../../models/cart-element';
import { ElementMenuType } from './../../models/site';
import { MenuElement } from '~/models/menu-element';
import { Component, OnInit } from '@angular/core';
import { ModalDialogParams } from '@nativescript/angular';
import { FullOptionsGroup } from '~/models/full-options-group';
import { FormBuilder, FormGroup } from '@angular/forms';
import { screen } from "tns-core-modules/platform";
import { action } from "tns-core-modules/ui/dialogs";

@Component({
  selector: 'app-string-options-select',
  templateUrl: './string-options-select.component.html',
  styleUrls: ['./string-options-select.component.scss']
})
export class StringOptionsSelectComponent implements OnInit {

  element: MenuElement
  index: number | null
  priceNameIndex: number | null
  opts: string[] = []
  scrollWidth: number = Math.ceil(screen.mainScreen.widthDIPs) - 60;
  optionsElements: string[] = []
  formQ: FormGroup
  serveType: ServeType = ServeType.plate
  countArray: Array<string> = [];
  onOnePlate: boolean = true
  accArray: Array<{ acc: { name: string, icon: string }, howMany: number }> = []
  appConfig: AppConfig
  parentOnOnePlate: boolean
  parentOrderActionType: OrderActionType


  constructor(private params: ModalDialogParams, private fb: FormBuilder, private cartService: CartService) {
    this.element = params.context.element
    this.priceNameIndex = params.context.priceNameIndex
    this.appConfig = params.context.appConfig
    this.parentOnOnePlate = params.context.onOnePlate
    this.onOnePlate = this.parentOnOnePlate
    this.parentOrderActionType = params.context.orderActionType
    if (this.element.canPack) {
      this.serveType = (this.parentOrderActionType == OrderActionType.delivery || this.parentOrderActionType == OrderActionType.takeAway) ? ServeType.pack : ServeType.plate
    }
    this.createAccArray()
    this.index = (!params.context.index && this.element.elementType == ElementMenuType.oneName) ? 0 : params.context.index
    this.opts = this.cartService.findOptionsByType(this.element, this.index)
  }

  ngOnInit(): void {
    this.formQ = this.fb.group({ quantity: [1] })
    this.makeCountArray()
  }

  makeCountArray() {
    this.countArray = Array.from(
      { length: parseInt(this.formQ.get("quantity").value) + 1 },
      (x, i) => String(i)
    );
  }

  createAccArray() {
    this.appConfig.data.acc.map(el => {
      this.accArray.push({
        acc: el,
        howMany: 0
      })
    })
  }


  pushType(p: string) {
    if (this.optionsElements.length < Number(this.formQ.get('quantity').value)) {
      this.optionsElements.push(p)
    }
  }

  clearTag(index: number) {
    this.optionsElements.splice(index, 1)
  }

  close() {

    let gr: FullOptionsGroup = {
      descElements: [],
      reverseElements: [],
      plusElements: [],
      optionsElements: this.optionsElements,
      description: "",
      quantity: Number(this.formQ.get('quantity').value),
      isSea: false,
      configFirstIndex: null,
      configSecondIndex: null,
      configThirdIndex: null,
      onOnePlate: this.onOnePlate,
      acc: this.accArray,
      gluten: 0,
      grill: 0,
      index: this.index,
      serveType: this.serveType,
      priceNameIndex: this.priceNameIndex,
      extra: 0,
      stepOptionsList: []
    }
    this.params.closeCallback(gr)
  }

  findIsSea(): boolean {
    switch (this.element.elementType) {
      case ElementMenuType.oneName:
        return this.element.price[this.index].isSea
        break
      case ElementMenuType.manyNames:
        return this.element.priceNames[this.index].price[this.priceNameIndex].isSea
        break;

      case ElementMenuType.descElements:
        return this.element.descElements[this.index].isSea
        break

      case ElementMenuType.configPrice:
        return this.element.price[this.index].isSea
        break

      default:
        return false
        break
    }
  }

  qChange(action: 'plus' | 'minus') {
    var currentValue: number = parseInt(this.formQ.get('quantity').value)
    // console.log(currentValue)
    switch (action) {
      case "minus":

        if (currentValue > 1) {
          currentValue--
          // console.log('minus', currentValue)
          this.formQ.get('quantity').setValue(currentValue)
        }

        break
      case "plus":
        currentValue++
        // console.log('plus', currentValue)
        this.formQ.get('quantity').setValue(currentValue)
        break
    }

    if (this.formQ.get('quantity').value < this.optionsElements.length) {
      this.optionsElements.splice(this.optionsElements.length - 1, 1)
    }
    // this.changeAccIfIsMoreThenQuantity()
  }

  changeOnePlate() {
    this.onOnePlate = (this.onOnePlate) ? false : true
  }

  changeServe() {
    this.serveType = (this.serveType == ServeType.pack) ? ServeType.plate : ServeType.pack
  }

  changeAcc(event: AccElement[]) {
    this.accArray = event
  }

  // selectAcc(acc: { name: string, icon: string }) {
  //   let options = {
  //     title: "Ilość dodatkowego " + acc.name + ".",
  //     message: "",
  //     cancelButtonText: "Anuluj",
  //     actions: this.countArray,
  //   };
  //   action(options).then((result: string) => {
  //     if (result != "Anuluj") {
  //       // console.log(result, acc)
  //       this.findAndChangeAcc(acc, result)
  //     }
  //   });
  // }

  // findAndChangeAcc(acc: { name: string, icon: string }, value: string) {
  //   this.accArray.map((a, i) => {
  //     if (a.acc.name == acc.name) {
  //       this.accArray[i].howMany = parseInt(value)
  //     }
  //   })
  // }

  // changeAccIfIsMoreThenQuantity() {
  //   this.accArray.map((a, i) => {
  //     if (a.howMany > parseInt(this.formQ.get('quantity').value)) {
  //       this.accArray[i].howMany = parseInt(this.formQ.get('quantity').value)
  //     }
  //   })
  // }


}
