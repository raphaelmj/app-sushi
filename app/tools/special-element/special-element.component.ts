import { AccElement } from './../../models/cart-element';
import { CalculateService } from './../../services/calculate/calculate.service';
import { OrderActionType } from '~/models/cart-order';
import { AppConfig } from './../../models/app-config';
import { AfterViewInit } from '@angular/core';
import { Validators } from '@angular/forms';
import { SelectedIndexChangedEventData } from 'tns-core-modules/ui/tab-view';
import { TextView } from 'tns-core-modules/ui'
import { FullOptionsGroup } from '~/models/full-options-group';
import { DescOptions } from './../../models/desc-options';
import { ReverseOptions } from './../../models/reverse-options';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ModalDialogParams } from '@nativescript/angular';
import { Component, OnInit, ViewChild } from '@angular/core';
import { screen } from "tns-core-modules/platform";
import { on } from "tns-core-modules/application";
import { action } from "tns-core-modules/ui/dialogs";
import * as utils from "tns-core-modules/utils/utils";
import { ServeType } from '~/models/cart-element';

@Component({
  selector: 'app-special-element',
  templateUrl: './special-element.component.html',
  styleUrls: ['./special-element.component.scss']
})
export class SpecialElementComponent implements OnInit, AfterViewInit {

  @ViewChild(TextView, { static: false }) textView: TextView
  elementOptions: { desc: DescOptions[], reverse: ReverseOptions[] }
  wordsOutput: string[] = []
  scrollHeight: number = Math.ceil(screen.mainScreen.heightDIPs) - 160;
  formDesc: FormGroup
  priceTotal: number
  gluten: number = 0
  grill: number = 0
  isSea: boolean = true
  isActiveEdit: boolean = false
  countArray: Array<string> = [];
  countHalfArray: Array<string> = [];
  serveType: ServeType = ServeType.plate
  onOnePlate: boolean = true
  accArray: Array<{ acc: { name: string, icon: string }, howMany: number }> = []
  appConfig: AppConfig
  parentOnOnePlate: boolean
  parentOrderActionType: OrderActionType

  constructor(private params: ModalDialogParams, private fb: FormBuilder, private calculateService: CalculateService) {
    this.elementOptions = params.context.elementOptions
    this.appConfig = params.context.appConfig
    this.parentOnOnePlate = params.context.onOnePlate
    this.onOnePlate = this.parentOnOnePlate
    this.parentOrderActionType = params.context.orderActionType
    this.serveType = (this.parentOrderActionType == OrderActionType.delivery || this.parentOrderActionType == OrderActionType.takeAway) ? ServeType.pack : ServeType.plate

    utils.ad.dismissSoftInput();
  }


  ngOnInit(): void {
    this.changeOrientationObserve()
    this.formDesc = this.fb.group({
      description: [''],
      quantity: [1],
      price: [10, [Validators.pattern('[0-9]+'), Validators.required]]
    })
    this.priceTotal = 10
    this.makeCountArray()
    this.makeCountHalfArray()
    this.createAccArray()
  }

  ngAfterViewInit(): void {
    // this.textView.dismissSoftInput()
  }


  createAccArray() {
    this.appConfig.data.acc.map(el => {
      this.accArray.push({
        acc: el,
        howMany: 0
      })
    })
  }


  changeOrientationObserve() {
    on("orientationChanged", (evt) => {
      this.scrollHeight = Math.ceil(screen.mainScreen.heightDIPs) - 160;
    });
  }

  onSelectedIndexchanged(event: SelectedIndexChangedEventData) {

  }

  qChange(action: "plus" | "minus") {
    var currentValue: number = parseInt(this.formDesc.get("quantity").value);
    // console.log(currentValue)
    if (!this.formDesc.get("price").valid) {
      this.formDesc.get("price").setValue(10)
    } else {
      switch (action) {
        case "minus":
          if (currentValue > 1) {
            currentValue--;
            // console.log('minus', currentValue)
            this.formDesc.get("quantity").setValue(currentValue);
          }

          break;
        case "plus":
          currentValue++;
          // console.log('plus', currentValue)
          this.formDesc.get("quantity").setValue(currentValue);
          break;
      }
    }
    this.makeCountArray()
    this.makeCountHalfArray()

    this.priceTotal = this.calculateService.multipleQuantity(this.formDesc.get("price").value, currentValue)

  }

  makeCountArray() {
    this.countArray = Array.from(
      { length: parseInt(this.formDesc.get("quantity").value) + 1 },
      (x, i) => String(i)
    );
  }

  makeCountHalfArray() {
    this.countHalfArray = Array.from(
      { length: (parseInt(this.formDesc.get("quantity").value) * 2) + 1 },
      (x, i) => {
        return (i ** 2 == 0) ? String(i) : String(i / 2)
      }
    );
  }

  selectGluten() {
    let options = {
      title: "Ilość dań bez glutenu",
      message: "",
      cancelButtonText: "Anuluj",
      actions: this.countArray,
    };
    action(options).then((result: string) => {
      if (result != "Anuluj") {
        // console.log(result)
        this.gluten = parseInt(result)
      }
    });
  }

  selectGrill() {
    let options = {
      title: "Ilość dań grillowanych",
      message: "",
      cancelButtonText: "Anuluj",
      actions: this.countHalfArray,
    };
    action(options).then((result: string) => {
      if (result != "Anuluj") {
        // console.log(result)
        this.grill = parseFloat(result)
      }
    });
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

  findAndChangeAcc(acc: { name: string, icon: string }, value: string) {
    this.accArray.map((a, i) => {
      if (a.acc.name == acc.name) {
        this.accArray[i].howMany = parseInt(value)
      }
    })
  }

  changeSea() {
    this.isSea = (this.isSea) ? false : true
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

  closeAndSave() {
    let gr: FullOptionsGroup = {
      descElements: this.wordsOutput,
      reverseElements: [],
      plusElements: [],
      optionsElements: [],
      description: this.formDesc.get('description').value,
      quantity: this.formDesc.get('quantity').value,
      gluten: this.gluten,
      grill: this.grill,
      isSea: this.isSea,
      serveType: this.serveType,
      onOnePlate: this.onOnePlate,
      acc: this.accArray,
      stepOptionsList: [],
      extra: 0
    }
    if (this.formDesc.get('price').valid)
      this.params.closeCallback({ isOptions: true, data: gr, price: this.formDesc.get('price').value })
  }

  closeExit() {
    this.params.closeCallback(false)
  }

}
