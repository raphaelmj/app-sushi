import { OrderActionType } from '~/models/cart-order';
import { AppConfig } from '~/models/app-config';
import { ServeType, AccElement } from './../../models/cart-element';
import { ElementMenuType } from './../../models/site';
import { MenuElement } from '~/models/menu-element';
import { Component, OnInit } from '@angular/core';
import { ModalDialogParams } from '@nativescript/angular';
import { FormBuilder, FormGroup } from '@angular/forms';
import { FullOptionsGroup } from '~/models/full-options-group';
import { action } from "tns-core-modules/ui/dialogs";

@Component({
  selector: 'app-quantity-modal',
  templateUrl: './quantity-modal.component.html',
  styleUrls: ['./quantity-modal.component.scss']
})
export class QuantityModalComponent implements OnInit {

  element: MenuElement
  index: number | null
  priceNameIndex: number | null
  formQ: FormGroup
  serveType: ServeType = ServeType.plate
  appConfig: AppConfig
  onOnePlate: boolean = true
  countArray: Array<string> = [];
  accArray: Array<{ acc: { name: string, icon: string }, howMany: number }> = []
  parentOnOnePlate: boolean
  parentOrderActionType: OrderActionType


  constructor(private params: ModalDialogParams, private fb: FormBuilder) {
    this.element = params.context.element
    this.index = (!params.context.index && this.element.elementType == ElementMenuType.oneName) ? 0 : params.context.index
    this.priceNameIndex = params.context.priceNameIndex
    this.appConfig = params.context.appConfig
    this.parentOnOnePlate = params.context.onOnePlate
    this.onOnePlate = this.parentOnOnePlate
    this.parentOrderActionType = params.context.orderActionType
    if (this.element.canPack) {
      this.serveType = (this.parentOrderActionType == OrderActionType.delivery || this.parentOrderActionType == OrderActionType.takeAway) ? ServeType.pack : ServeType.plate
    }
    this.createAccArray()
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

  close() {

    let gr: FullOptionsGroup = {
      descElements: [],
      reverseElements: [],
      plusElements: [],
      description: "",
      quantity: Number(this.formQ.get('quantity').value),
      index: this.index,
      priceNameIndex: this.priceNameIndex,
      configFirstIndex: null,
      configSecondIndex: null,
      configThirdIndex: null,
      onOnePlate: this.onOnePlate,
      acc: this.accArray,
      grill: 0,
      gluten: 0,
      extra: 0,
      stepOptionsList: [],
      serveType: this.serveType
    }
    this.params.closeCallback(gr)
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
    this.makeCountArray()
    // this.changeAccIfIsMoreThenQuantity()
  }

  changeServe() {
    this.serveType = (this.serveType == ServeType.pack) ? ServeType.plate : ServeType.pack
  }

  changeOnePlate() {
    this.onOnePlate = (this.onOnePlate) ? false : true
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
