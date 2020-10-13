import { CalculateService } from './../../services/calculate/calculate.service';
import { StepOneTwo } from './../config-step-options/config-step-options.component';
import { OrderActionType } from '~/models/cart-order';
import { AppConfig } from '~/models/app-config';
import { ElementConfigStepsPrice, ElementConfigStepsPriceType, PriceTypeOption } from './../../models/menu-element';
import { OnDestroy } from '@angular/core';
import { FullOptionsGroup } from './../../models/full-options-group';
import { Subscription } from 'rxjs';
import { CartService } from '~/services/cart.service';
import { ModalDialogParams } from '@nativescript/angular';
import { CartCategory } from './../../models/cart-category';
import { ReverseElement, StepOptionsListElement } from '~/models/cart-element';
import { ServeType, PlusElement } from './../../models/cart-element';
import { ReverseOptions } from './../../models/reverse-options';
import { DescOptions } from './../../models/desc-options';
import { CustomOptionsViewComponent } from './../custom-options-view/custom-options-view.component';
import { AllOptionsPlusViewComponent } from './../all-options-plus-view/all-options-plus-view.component';
import { ViewContainerRef, ComponentRef, ComponentFactoryResolver, Type } from '@angular/core';
import { ViewChild } from '@angular/core';
import { MenuElement } from '~/models/menu-element';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { screen } from "tns-core-modules/platform";
import { on } from "tns-core-modules/application";
import * as utils from "tns-core-modules/utils/utils";
import { action } from "tns-core-modules/ui/dialogs";

@Component({
  selector: 'app-config-step-options-many',
  templateUrl: './config-step-options-many.component.html',
  styleUrls: ['./config-step-options-many.component.scss']
})
export class ConfigStepOptionsManyComponent implements OnInit {

  @ViewChild('temp', { read: ViewContainerRef, static: false }) temp: ViewContainerRef
  allPlusC: ComponentRef<AllOptionsPlusViewComponent>
  customC: ComponentRef<CustomOptionsViewComponent>

  element: MenuElement
  menuPlusElements: MenuElement[]
  sets: MenuElement[]
  index: number | null
  formData: FormGroup
  priceNameIndex: number | null
  configFirstIndex: number = 0
  configSecondIndex: number = 0
  configThirdIndex: number = 0
  baseElementOptions: { desc: DescOptions[], reverse: ReverseOptions[] }
  scrollHeight: number = Math.ceil(screen.mainScreen.heightDIPs) - 160;
  grill: number = 0
  gluten: number = 0
  isSea: boolean = false
  hasSea: boolean = false
  priceTotal: number = 0
  priceCurrent: number
  countArray: Array<string> = [];
  countHalfArray: Array<string> = [];
  pricesCount: number = 1
  selectedIndex: number = 0
  serveType: ServeType
  extra: number = 0
  onOnePlate: boolean = true
  appConfig: AppConfig
  accArray: Array<{ acc: { name: string, icon: string }, howMany: number }> = []
  parentOnOnePlate: boolean
  parentOrderActionType: OrderActionType

  plusElements: PlusElement[] = []
  reverseElements: ReverseElement[] = []
  descElements: Array<string> = []
  optionsElements: string[] = []
  cartPlusCategories: CartCategory[] = []

  stepOptionsList: StepOptionsListElement[] = []

  mergeSteps: StepOneTwo[] = []

  subAllChange: Subscription
  subCustomChange: Subscription


  constructor(
    private params: ModalDialogParams,
    private cf: ComponentFactoryResolver,
    private fb: FormBuilder,
    private cartService: CartService,
    private calculateService: CalculateService
  ) {
    this.element = params.context.element
    this.baseElementOptions = params.context.elementOptions
    this.menuPlusElements = params.context.menuPlusElements
    this.index = params.context.index
    this.priceNameIndex = params.context.priceNameIndex
    this.cartPlusCategories = params.context.cartPlusCategories
    this.serveType = ServeType.plate
    this.appConfig = params.context.appConfig
    this.parentOnOnePlate = params.context.onOnePlate
    this.onOnePlate = this.parentOnOnePlate
    this.parentOrderActionType = params.context.orderActionType
    if (this.element.canPack) {
      this.serveType = (this.parentOrderActionType == OrderActionType.delivery || this.parentOrderActionType == OrderActionType.takeAway) ? ServeType.pack : ServeType.plate
    }
    this.findIsHasSea()
    this.createAccArray()
    utils.ad.dismissSoftInput();
  }

  ngOnInit(): void {
    this.formData = this.fb.group({
      description: ['']
    })
    if (!this.element.skipStepOne) {
      this.findPriceCurrent()
    } else {
      this.mergeStepOneAndTwo()
    }
    this.pricePlusPrice()
    this.makeCountArray()
  }

  mergeStepOneAndTwo() {
    this.element.configStepsPrice.map((el: ElementConfigStepsPrice, i: number) => {
      el.types.map((t: ElementConfigStepsPriceType, j: number) => {
        this.mergeSteps.push({
          name: t.type,
          indexOne: i,
          indexTwo: j,
          options: t.options
        })
      })
    })
    this.selectFirstSecondType(this.mergeSteps[0])
  }

  selectFirstSecondType(step: StepOneTwo) {
    this.selectFirstType(step.indexOne)
    this.selectSecondType(step.indexTwo)
  }

  findIsHasSea() {
    this.element.configStepsPrice.map((el: ElementConfigStepsPrice, i) => {
      el.types.map((e: ElementConfigStepsPriceType, i) => {
        e.options.map((o: PriceTypeOption, i) => {
          if (o.isSea) {
            this.hasSea = true
          }
        })
      })
    })
  }

  selectFirstType(i: number) {
    this.configFirstIndex = i
    this.configSecondIndex = 0
    this.configThirdIndex = 0
    this.findPriceCurrent()
    this.pricePlusPrice()
  }

  selectSecondType(i: number) {
    this.configSecondIndex = i
    this.configThirdIndex = 0
    this.findPriceCurrent()
    this.pricePlusPrice()
  }

  selectThirdType(i: number) {
    this.configThirdIndex = i
    this.findPriceCurrent()
    this.pricePlusPrice()
  }

  findPriceCurrent() {
    if (this.element.configStepsPrice.length > 0) {
      if (this.element.configStepsPrice[this.configFirstIndex].types.length > 0) {
        if (this.element.configStepsPrice[this.configFirstIndex].types[this.configSecondIndex].options.length > 0) {
          this.priceCurrent = this.calculateService.stringToNumber(this.element.configStepsPrice[this.configFirstIndex].types[this.configSecondIndex].options[this.configThirdIndex].price)
        }
      }
    }
  }

  findPriceAndSeaBySteps(configFirstIndex: number, configSecondIndex: number, configThirdIndex: number): { priceCurrent: number, isSea: boolean } {
    var priceCurrent: number = 0
    var isSea: boolean = false
    if (this.element.configStepsPrice[configFirstIndex].types.length > 0) {
      if (this.element.configStepsPrice[configFirstIndex].types[configSecondIndex].options.length > 0) {
        priceCurrent = this.calculateService.stringToNumber(this.element.configStepsPrice[configFirstIndex].types[configSecondIndex].options[configThirdIndex].price)
        isSea = this.element.configStepsPrice[configFirstIndex].types[configSecondIndex].options[configThirdIndex].isSea
      }
    }
    return { priceCurrent, isSea }
  }

  priceMake() {
    this.findPriceCurrent()
    this.priceTotal = this.calculateService.plusElements(this.priceTotal, this.priceCurrent)
  }

  pricePlusPrice() {
    var pc: Array<string | number> = []
    this.plusElements.map(a => {
      pc.push(a.price)
    })
    this.priceTotal = this.calculateService.pricePlusMapElements(this.priceTotal, pc)
  }

  createAccArray() {
    this.appConfig.data.acc.map(el => {
      this.accArray.push({
        acc: el,
        howMany: 0
      })
    })
  }

  addStepOption() {
    this.stepOptionsList.push({
      configFirstIndex: this.configFirstIndex,
      configSecondIndex: this.configSecondIndex,
      configThirdIndex: this.configThirdIndex,
      pricePerOne: this.priceCurrent
    })
    this.makeCountArray()
    this.makeCountHalfArray()
    this.changeAccIfIsMoreThenQuantity()
    this.priceMake()
  }

  removeStepOption(i: number) {
    var step: StepOptionsListElement = this.stepOptionsList[i]
    var { priceCurrent, isSea } = this.findPriceAndSeaBySteps(step.configFirstIndex, step.configSecondIndex, step.configThirdIndex)
    this.priceTotal = this.calculateService.minusElements(this.priceTotal, priceCurrent)
    this.stepOptionsList.splice(i, 1)
    this.makeCountArray()
    this.makeCountHalfArray()
    this.changeAccIfIsMoreThenQuantity()
  }

  makeCountArray() {
    this.countArray = Array.from(
      { length: this.stepOptionsList.length + 1 },
      (x, i) => String(i)
    );
  }

  makeCountHalfArray() {
    this.countHalfArray = Array.from(
      { length: (this.stepOptionsList.length * 2) + 1 },
      (x, i) => {
        return (i ** 2 == 0) ? String(i) : String(i / 2)
      }
    );
  }

  openAllOptionsPlus() {
    this.temp.clear()
    let all = this.cf.resolveComponentFactory(<Type<AllOptionsPlusViewComponent>>AllOptionsPlusViewComponent)
    this.allPlusC = this.temp.createComponent(all)
    this.allPlusC.instance.cartPlusCategories = this.cartPlusCategories
    this.allPlusC.instance.elementOptions = this.baseElementOptions
    this.subAllChange = this.allPlusC.instance.emitChange.subscribe((r: { plusElements: PlusElement[], reverseElements: ReverseElement[], descElements: string[] }) => {
      this.plusElements = r.plusElements
      this.reverseElements = r.reverseElements
      this.descElements = r.descElements
      this.findPriceCurrent()
      this.priceMake()
      this.pricePlusPrice()
    })
    this.selectedIndex = 1
  }


  openCustomOptions() {
    this.temp.clear()
    let custom = this.cf.resolveComponentFactory(<Type<CustomOptionsViewComponent>>CustomOptionsViewComponent)
    this.customC = this.temp.createComponent(custom)
    this.customC.instance.elementOptions = this.baseElementOptions
    this.subCustomChange = this.customC.instance.optionChanged.subscribe((r: { reverseElements: ReverseElement[], wordsOutput: Array<string> }) => {
      this.reverseElements = r.reverseElements
      this.descElements = r.wordsOutput
    })
    this.selectedIndex = 1
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

  changeServe() {
    this.serveType = (this.serveType == ServeType.pack) ? ServeType.plate : ServeType.pack
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

  changeOnePlate() {
    this.onOnePlate = (this.onOnePlate) ? false : true
  }

  selectAcc(acc: { name: string, icon: string }) {
    let options = {
      title: "Ilość dodatkowego " + acc.name + ".",
      message: "",
      cancelButtonText: "Anuluj",
      actions: this.countArray,
    };
    action(options).then((result: string) => {
      if (result != "Anuluj") {
        // console.log(result, acc)
        this.findAndChangeAcc(acc, result)
      }
    });
  }

  findAndChangeAcc(acc: { name: string, icon: string }, value: string) {
    this.accArray.map((a, i) => {
      if (a.acc.name == acc.name) {
        this.accArray[i].howMany = parseInt(value)
      }
    })
  }

  changeAccIfIsMoreThenQuantity() {
    this.accArray.map((a, i) => {
      if (a.howMany > this.stepOptionsList.length) {
        this.accArray[i].howMany = this.stepOptionsList.length
      }
    })
  }

  closeExit() {
    if (this.allPlusC) {
      this.allPlusC.instance.temp.clear()
    }
    this.temp.clear()
    this.params.closeCallback(false)
  }

  add() {
    if (this.stepOptionsList.length > 0) {
      this.temp.clear()
      var fo: FullOptionsGroup = {
        optionsElements: this.optionsElements,
        descElements: this.descElements,
        reverseElements: this.reverseElements,
        plusElements: this.plusElements,
        description: this.formData.get('description').value,
        quantity: 1,
        isSea: this.isSea,
        index: this.index,
        priceNameIndex: this.index,
        configFirstIndex: this.configFirstIndex,
        configSecondIndex: this.configSecondIndex,
        configThirdIndex: this.configThirdIndex,
        onOnePlate: this.onOnePlate,
        acc: this.accArray,
        grill: this.grill,
        gluten: this.gluten,
        extra: this.extra,
        stepOptionsList: this.stepOptionsList,
        serveType: this.serveType
      }
      this.params.closeCallback(fo)
    }
  }

  ngOnDestroy(): void {
    if (this.subAllChange)
      this.subAllChange.unsubscribe()
    if (this.subCustomChange)
      this.subCustomChange.unsubscribe()
  }

}
