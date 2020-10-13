import { CalculateService } from './../../services/calculate/calculate.service';
import { OrderActionType } from '~/models/cart-order';
import { AppConfig } from '~/models/app-config';
import { CartCategory } from '~/models/cart-category';
import { ServeType, ElementType, AccElement } from './../../models/cart-element';
import { TextView } from 'tns-core-modules/ui';
import { OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { CustomOptionsViewComponent } from './../custom-options-view/custom-options-view.component';
import { FullOptionsGroup } from '~/models/full-options-group';
import { ReverseElement } from '~/models/cart-element';
import { PlusElement } from '~/models/cart-element';
import { ViewContainerRef, ComponentRef, Type } from '@angular/core';
import { PriceConfigSort } from './../../models/price-config-sort';
import { CartService } from '~/services/cart.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AfterViewInit, ViewChild } from '@angular/core';
import { ReverseOptions } from './../../models/reverse-options';
import { DescOptions } from './../../models/desc-options';
import { SiteElement, ElementMenuType } from './../../models/site';
import { MenuElement } from '~/models/menu-element';
import { ModalDialogParams } from '@nativescript/angular';
import { Component, OnInit, ComponentFactoryResolver } from '@angular/core';
import { screen } from "tns-core-modules/platform";
import { on } from "tns-core-modules/application";
import * as utils from "tns-core-modules/utils/utils";
import { action } from "tns-core-modules/ui/dialogs";
import { AllOptionsPlusViewComponent } from '../all-options-plus-view/all-options-plus-view.component';

@Component({
  selector: 'app-step-options',
  templateUrl: './step-options.component.html',
  styleUrls: ['./step-options.component.scss']
})
export class StepOptionsComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild(TextView, { static: false }) textView: TextView
  @ViewChild('temp', { read: ViewContainerRef, static: false }) temp: ViewContainerRef
  allPlusC: ComponentRef<AllOptionsPlusViewComponent>
  customC: ComponentRef<CustomOptionsViewComponent>

  element: MenuElement
  menuPlusElements: MenuElement[]
  sets: MenuElement[]
  index: number | null
  formData: FormGroup
  priceNameIndex: number | null
  baseElementOptions: { desc: DescOptions[], reverse: ReverseOptions[] }
  scrollHeight: number = Math.ceil(screen.mainScreen.heightDIPs) - 160;
  grill: number = 0
  gluten: number = 0
  isSea: boolean = false
  hasSea: boolean = false
  priceConfigSort: PriceConfigSort[]
  priceTotal: number
  pricePerOne: number
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
  plusPrice: number = 0

  plusElements: PlusElement[] = []
  reverseElements: ReverseElement[] = []
  descElements: Array<string> = []
  optionsElements: string[] = []
  cartPlusCategories: CartCategory[] = []

  options: string[] = []

  subAllChange: Subscription
  subCustomChange: Subscription

  elementType = ElementType


  constructor(
    private params: ModalDialogParams,
    private cf: ComponentFactoryResolver,
    private fb: FormBuilder,
    private cartService: CartService,
    private calculateService: CalculateService
  ) {
    this.element = params.context.element
    // this.sets = params.context.sets
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
    this.options = this.cartService.findOptionsByType(this.element, this.index)
    utils.ad.dismissSoftInput();
  }



  ngOnInit(): void {
    this.formData = this.fb.group({
      description: [''],
      quantity: [1],
    })
    this.createAccArray()
    this.initViewDataOptions()
    this.priceMake()
    this.makeCountArray()
    this.makeCountHalfArray()
  }


  ngAfterViewInit(): void {
    if (this.textView)
      this.textView.dismissSoftInput();
  }

  createAccArray() {
    this.appConfig.data.acc.map(el => {
      this.accArray.push({
        acc: el,
        howMany: 0
      })
    })
  }

  addOptions(p: string) {
    if (this.formData.get('quantity').value > this.optionsElements.length) {
      this.optionsElements.push(p)
    }
  }

  removeOption(i: number) {
    this.optionsElements.splice(i, 1)
  }

  priceMake() {
    this.findPricePerOne()
    var priceTotalQuaOnly: number = this.calculateService.multipleQuantity(this.formData.get("quantity").value, this.pricePerOne);
    this.priceTotal = this.calculateService.plusElements(priceTotalQuaOnly, this.plusPrice);
  }

  pricePlusPrice() {
    // var ps: Array<string | number> = []
    // this.plusElements.map(a => {
    //   ps.push(a.price)
    // })
    this.plusPrice = this.getPlusPrice()
    this.priceTotal = this.calculateService.plusElements(this.priceTotal, this.plusPrice)
  }

  getPlusPrice() {
    var ps: Array<string | number> = []
    this.plusElements.map(a => {
      ps.push(a.price)
    })
    return this.calculateService.pricePlusMapElements(0, ps)
  }

  findPricePerOne() {
    switch (this.element.elementType) {
      case ElementMenuType.oneName:

        this.element.price.map((p, i) => {
          if (this.isSea == p.isSea) {
            this.pricePerOne = Number(p.price)
            this.index = i
          }
        })

        break
      case ElementMenuType.manyNames:

        this.element.priceNames[this.index].price.map((p, i) => {
          if (this.isSea == p.isSea) {
            this.pricePerOne = Number(p.price)
            this.priceNameIndex = i
          }
        })

        break;

      case ElementMenuType.descElements:

        if (this.hasSea) {
          if (this.isSea && this.element.descElements[this.index].seaPrice != "") {
            this.pricePerOne = Number(this.element.descElements[this.index].seaPrice)
          } else if (this.element.descElements[this.index].price != "") {
            this.pricePerOne = Number(this.element.descElements[this.index].price)
          } else {
            this.isSea = true
            this.pricePerOne = Number(this.element.descElements[this.index].seaPrice)
          }
        } else {
          this.pricePerOne = Number(this.element.descElements[this.index].price)
        }

        break

      case ElementMenuType.configPrice:

        this.pricePerOne = Number(this.element.price[this.index].price)

        break
    }

  }

  initViewDataOptions() {
    switch (this.element.elementType) {
      case ElementMenuType.oneName:

        this.element.price.map(p => {
          if (p.isSea) {
            this.hasSea = true
          }
        })

        if (this.element.price.length == 1 && this.hasSea) {
          this.isSea = true
        }

        this.pricesCount = this.element.price.length

        break
      case ElementMenuType.manyNames:
        this.element.priceNames[this.index].price.map(p => {
          if (p.isSea) {
            this.hasSea = true
          }
        })

        if (this.element.priceNames[this.index].price.length == 1 && this.hasSea) {
          this.isSea = true
        }

        this.pricesCount = this.element.priceNames[this.index].price.length

        break;

      case ElementMenuType.descElements:

        this.hasSea = this.element.descElements[this.index].isSea
        if (this.element.descElements[this.index].price != "" && this.element.descElements[this.index].seaPrice != "") {
          this.pricesCount = 2
          this.hasSea = true
        }


        break

      case ElementMenuType.configPrice:

        this.element.price.map(p => {
          if (p.isSea) {
            this.hasSea = true
          }
        })
        this.index = 0
        this.priceConfigSort = this.cartService.preparePriceConfigArray(this.element.price)

        break

      default:

        break
    }

  }

  qChange(action: "plus" | "minus") {
    var currentValue: number = parseInt(this.formData.get("quantity").value);
    switch (action) {
      case "minus":
        if (currentValue > 1) {
          currentValue--;
          this.formData.get("quantity").setValue(currentValue);
        }

        break;
      case "plus":
        currentValue++;
        this.formData.get("quantity").setValue(currentValue);
        break;
    }

    if (this.plusElements.length > 0 && this.formData.get('quantity').value > 1) {
      this.plusElements = []
    }

    if (this.formData.get('quantity').value < this.optionsElements.length) {
      this.optionsElements.splice(this.optionsElements.length - 1, 1)
    }

    this.makeCountArray()
    this.makeCountHalfArray()
    // this.changeAccIfIsMoreThenQuantity()
    this.priceTotal = this.calculateService.multipleQuantity(currentValue, this.pricePerOne)

  }

  makeCountArray() {
    this.countArray = Array.from(
      { length: parseInt(this.formData.get("quantity").value) + 1 },
      (x, i) => String(i)
    );
  }

  makeCountHalfArray() {
    this.countHalfArray = Array.from(
      { length: (parseInt(this.formData.get("quantity").value) * 2) + 1 },
      (x, i) => {
        return (i ** 2 == 0) ? String(i) : String(i / 2)
      }
    );
  }

  changeSea() {
    if (this.hasSea) {
      this.isSea = (this.isSea) ? false : true
      this.priceMake()
    }
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

  changeConfigElement(event: { index: number, isSea: boolean }) {
    this.index = event.index
    this.isSea = event.isSea
    this.priceMake()
  }

  changeAcc(event: AccElement[]) {
    this.accArray = event
  }


  // selectAcc(acc: { name: string, icon: string }) {
  //   let options = {
  //     title: "Ilość dań bez glutenu",
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
  //     if (a.howMany > parseInt(this.formData.get('quantity').value)) {
  //       this.accArray[i].howMany = parseInt(this.formData.get('quantity').value)
  //     }
  //   })
  // }


  openAllOptionsPlus() {
    this.temp.clear()
    let all = this.cf.resolveComponentFactory(<Type<AllOptionsPlusViewComponent>>AllOptionsPlusViewComponent)
    this.allPlusC = this.temp.createComponent(all)
    this.allPlusC.instance.plusElements = this.plusElements
    this.allPlusC.instance.cartPlusCategories = this.cartPlusCategories
    this.allPlusC.instance.elementOptions = this.baseElementOptions
    this.subAllChange = this.allPlusC.instance.emitChange.subscribe((r: { plusElements: PlusElement[], reverseElements: ReverseElement[], descElements: string[] }) => {
      this.plusElements = r.plusElements
      this.reverseElements = r.reverseElements
      this.descElements = r.descElements
      this.plusPrice = this.getPlusPrice()
      this.priceMake()

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

  backToElement() {
    this.selectedIndex = 0
  }

  closeExit() {
    if (this.allPlusC) {
      this.allPlusC.instance.temp.clear()
    }
    this.temp.clear()
    this.params.closeCallback(false)
  }

  add() {
    this.temp.clear()
    var fo: FullOptionsGroup = {
      optionsElements: this.optionsElements,
      descElements: this.descElements,
      reverseElements: this.reverseElements,
      plusElements: this.plusElements,
      description: this.formData.get('description').value,
      quantity: <number>this.formData.get('quantity').value,
      isSea: this.isSea,
      index: this.index,
      priceNameIndex: this.index,
      configFirstIndex: null,
      configSecondIndex: null,
      configThirdIndex: null,
      onOnePlate: this.onOnePlate,
      acc: this.accArray,
      grill: this.grill,
      gluten: this.gluten,
      extra: this.extra,
      stepOptionsList: [],
      serveType: this.serveType
    }
    this.params.closeCallback(fo)
  }

  ngOnDestroy(): void {
    if (this.subAllChange)
      this.subAllChange.unsubscribe()
    if (this.subCustomChange)
      this.subCustomChange.unsubscribe()
  }

}
