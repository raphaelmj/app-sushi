import { PlusElementsCartViewComponent } from './plus-elements-cart-view/plus-elements-cart-view.component';
import { AccElementsConfigComponent } from './../acc-elements-config/acc-elements-config.component';
import { CartOrder } from '~/models/cart-order';
import { CalculateService } from './../../services/calculate/calculate.service';
import { OrientationChangeService } from './../../services/orientation-change.service';
import { EditManyStepOptionsComponent } from './../edit-many-step-options/edit-many-step-options.component';
import { CartService } from '~/services/cart.service';
import { MessageService } from '~/services/message.service';
import { AccElement, ElementType } from './../../models/cart-element';
import { CartCategory } from '~/models/cart-category';
import { MenuElement } from './../../models/menu-element';
import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  OnDestroy,
  ViewContainerRef,
  ChangeDetectorRef,
  AfterViewInit,
  ViewChild,
  ComponentRef,
  ComponentFactoryResolver,
  Type,
} from "@angular/core";
import { CartElement, PlusElement, ServeType } from "~/models/cart-element";
import { SITE_URL } from "~/config";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Subscription } from "rxjs";
import { ModalDialogService, ModalDialogOptions } from "@nativescript/angular";
import { action } from "tns-core-modules/ui/dialogs";
import { SuggestDescComponent } from "~/tools/suggest-desc/suggest-desc.component";
import { PlusElementsComponent } from "~/tools/plus-elements/plus-elements.component";
import { ElementMenuType, SiteElement } from "~/models/site";
import { DescOptions } from "~/models/desc-options";
import { ReverseOptions } from "~/models/reverse-options";
import { ReverseDescComponent } from "../reverse-desc/reverse-desc.component";
import { OptionsElementChangeComponent } from "../options-element-change/options-element-change.component";
import { AppConfig } from '~/models/app-config';
import { ChangePriceComponent } from '../change-price/change-price.component';
import { distinctUntilChanged, debounceTime } from 'rxjs/operators'
import { Orientation } from 'tns-core-modules/ui/layouts/stack-layout';

@Component({
  selector: "app-cart-row-admin",
  templateUrl: "./cart-row-admin.component.html",
  styleUrls: ["./cart-row-admin.component.scss"],
})
export class CartRowAdminComponent implements OnInit, OnDestroy, AfterViewInit {

  @ViewChild('accTemp', { read: ViewContainerRef, static: true }) accTemp: ViewContainerRef
  accC: ComponentRef<AccElementsConfigComponent>

  @ViewChild('tempPlus', { read: ViewContainerRef, static: true }) tempPlus: ViewContainerRef
  plusC: ComponentRef<PlusElementsCartViewComponent>

  @Output() emitChange: EventEmitter<{
    cartEl: CartElement;
    date: Date;
    index?: number
  }> = new EventEmitter<{ cartEl: CartElement; date: Date, index?: number }>();
  @Output() emitRemove: EventEmitter<{ cartEl: CartElement, index?: number }> = new EventEmitter<{ cartEl: CartElement, index?: number }>();
  @Input() cartEl: CartElement;
  @Input() elementOptions: { desc: DescOptions[]; reverse: ReverseOptions[] };
  @Input() offsetIndex: number
  @Input() appConfig: AppConfig
  @Input() plusCartCategories: CartCategory[]
  @Input() existOrder: boolean = false
  @Input() order: CartOrder
  @Input() oneExtraPrice: number
  siteUrl: string = SITE_URL;
  formEl: FormGroup;
  subChange: Subscription;
  countArray: Array<string> = [];
  countHalfArray: Array<string> = [];


  content: string = "";

  seaDouble: boolean = false

  elementType = ElementType

  subOrientChange: Subscription
  widthOptionsSteps: string = '33.33%'
  stepConfigListWidth: string = '75%'
  stepConfigPriceWidth: string = '25%'
  widthNormalPlus: string = '50%'

  subAccChange: Subscription

  constructor(
    private fb: FormBuilder,
    private modalService: ModalDialogService,
    private viewContainerRef: ViewContainerRef,
    private messageService: MessageService,
    private _changeDetectionRef: ChangeDetectorRef,
    private cartService: CartService,
    private orientationChangeService: OrientationChangeService,
    private calculateService: CalculateService,
    private cf: ComponentFactoryResolver
  ) { }



  ngOnInit(): void {
    this.createForm();
    this.makeCountArray();
    this.makeCountHalfArray()
    this.checkIsHasDoubleSea()
    this.subscribeToOrientChange()
    this.orientationChangeService.changeEmit()

    this.subChange = this.formEl
      .get("description")
      .valueChanges.pipe(
        debounceTime(1000),
        distinctUntilChanged()
      ).subscribe((value) => {
        let cartEl: CartElement = Object.assign({}, this.cartEl);
        cartEl.description = value;
        this.emitChange.emit({ cartEl, date: new Date() });
      });

  }

  ngAfterViewInit(): void {
    if (this.cartEl.canAcc) {
      this.renderAccComponent()
    }
    if (this.cartEl.elastic && this.cartEl.elementType != 'special') {
      this.renderPlusComponent()
    }
  }

  renderAccComponent() {
    let acc = this.cf.resolveComponentFactory(<Type<AccElementsConfigComponent>>AccElementsConfigComponent)
    this.accC = this.accTemp.createComponent(acc)
    this.accC.instance.acc = this.appConfig.data.acc
    this.accC.instance.dataAcc = this.cartEl.acc
    this.subAccChange = this.accC.instance.emitAccData.subscribe((d: AccElement[]) => {
      this.changeAcc(d)
    })
  }


  renderPlusComponent() {
    let plus = this.cf.resolveComponentFactory(<Type<PlusElementsCartViewComponent>>PlusElementsCartViewComponent)
    this.plusC = this.tempPlus.createComponent(plus)
    this.plusC.instance.plusElements = this.cartEl.plusElements
    this.plusC.instance.emitRemoveElement.subscribe((i: number) => {
      this.removePlusEl(i)
    })
    this.plusC.instance.emitRemovePlusOptions.subscribe((data: { i: number, j: number }) => {
      this.removePlusOption(data.i, data.j)
    })
    this.plusC.instance.emitRemovePlusStep.subscribe((data: { i: number, j: number }) => {
      this.removePlusStep(data.i, data.j)
    })
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

  createForm() {
    this.formEl = this.fb.group({
      quantity: [
        this.cartEl.quantity,
        [Validators.pattern("([1-9]+)([0-9]*)"), Validators.required],
      ],
      description: [this.cartEl.description],
    });
  }



  qChange(action: "plus" | "minus") {
    var currentValue: number = parseInt(this.formEl.get("quantity").value);
    // console.log(currentValue)
    switch (action) {
      case "minus":
        if (currentValue > 1) {
          currentValue--;
          // console.log('minus', currentValue)
          this.formEl.get("quantity").setValue(currentValue);
        }

        break;
      case "plus":
        currentValue++;
        // console.log('plus', currentValue)
        this.formEl.get("quantity").setValue(currentValue);
        break;
    }
    this.makeCountArray();
    this.makeCountHalfArray()
    this.cartEl.quantity = this.calculateService.stringToNumber(this.formEl.get("quantity").value);
    this.priceCalculate()
    // this.reduceAccAfterQuantityChange()

    if (this.cartEl.gluten > this.formEl.get("quantity").value) {
      this.cartEl.gluten = this.formEl.get("quantity").value;
    }
    this.emitChange.emit({ cartEl: this.cartEl, date: new Date(), index: this.offsetIndex });
  }



  priceCalculate() {
    this.cartEl.price = this.calculateService.multipleQuantity(this.formEl.get("quantity").value, this.cartEl.pricePerOne);
    var extra: number = this.calculateService.multipleValues(this.cartEl.extra, this.appConfig.data.extraPrice);
    var extraMultiQua: number = this.calculateService.multipleQuantity(this.formEl.get("quantity").value, extra);
    this.cartEl.price = this.calculateService.plusElements(extraMultiQua, this.cartEl.price);
  }

  changeStepOptions() {
    const options: ModalDialogOptions = {
      context: {
        cartEl: this.cartEl,
        appConfig: this.appConfig
      },
      viewContainerRef: this.viewContainerRef,
      fullscreen: true,
    };
    this.modalService
      .showModal(EditManyStepOptionsComponent, options)
      .then((r) => {
        this.emitChange.emit({ cartEl: this.cartEl, date: new Date(), index: this.offsetIndex });
      });
  }

  removeStepOption(i: number) {
    var extraPriceBefore: number = 0
    var extraOne: number = this.calculateService.multipleValues(this.cartEl.extra, this.appConfig.data.extraPrice)
    var extraAll: number = this.calculateService.multipleValues(this.cartEl.stepOptionsList.length, extraOne)
    extraPriceBefore = this.calculateService.plusElements(extraAll, extraPriceBefore)
    var minus: number = this.cartService.findPriceFromOneStepOptionsList(this.cartEl.stepOptionsList[i], this.cartEl.element.configStepsPrice)

    this.cartEl.price = this.calculateService.minusElements(this.cartEl.price, extraPriceBefore)
    this.cartEl.price = this.calculateService.minusElements(this.cartEl.price, minus)
    this.cartEl.pricePerOne = this.calculateService.minusElements(this.cartEl.pricePerOne, minus)
    this.cartEl.stepOptionsList.splice(i, 1)
    var extra: number = this.calculateService.multipleValues(this.cartEl.extra, this.appConfig.data.extraPrice)
    var newExtraPrice: number = this.calculateService.multipleValues(extra, this.cartEl.stepOptionsList.length)
    this.cartEl.price = this.calculateService.plusElements(this.cartEl.price, newExtraPrice)
    this.emitChange.emit({ cartEl: this.cartEl, date: new Date(), index: this.offsetIndex });
  }

  selectGluten() {

    if (this.cartEl.onlyGluten) {
      this.messageService.showAlert('Element dostępny jedynie w wersji glutenowej.')
    } else {
      let options = {
        title: "Ilość dań bez glutenu",
        message: "",
        cancelButtonText: "Anuluj",
        actions: this.countArray,
      };
      action(options).then((result: string) => {
        if (result != "Anuluj") {
          this.cartEl.gluten = Number(result);
          this.emitChange.emit({ cartEl: this.cartEl, date: new Date(), index: this.offsetIndex });
        }
      });
    }
  }

  selectGrill() {

    if (this.cartEl.onlyGrill) {
      this.messageService.showAlert('Element dostępny jedynie w wersji grillowanej.')
    } else {
      let options = {
        title: "Ilość dań grillowanych",
        message: "",
        cancelButtonText: "Anuluj",
        actions: this.countHalfArray,
      };
      action(options).then((result: string) => {
        if (result != "Anuluj") {
          this.cartEl.grill = parseFloat(result);
          this.emitChange.emit({ cartEl: this.cartEl, date: new Date(), index: this.offsetIndex });
        }
      });
    }


  }

  makeCountArray() {
    var qua = this.formEl.get("quantity").value
    if (this.cartEl.elementType == ElementMenuType.configStepsPriceMany) {
      qua = this.cartEl.stepOptionsList.length
    }
    this.countArray = Array.from(
      { length: parseInt(qua) + 1 },
      (x, i) => String(i)
    );
  }

  makeCountHalfArray() {
    var qua = this.formEl.get("quantity").value
    if (this.cartEl.elementType == ElementMenuType.configStepsPriceMany) {
      qua = this.cartEl.stepOptionsList.length
    }
    this.countHalfArray = Array.from(
      { length: (parseInt(qua) * 2) + 1 },
      (x, i) => {
        return (i ** 2 == 0) ? String(i) : String(i / 2)
      }
    );
  }

  extraChange(action: 'plus' | 'minus') {

    if (this.cartEl.elementType == 'config_steps_price_many') {
      var qua = this.cartEl.stepOptionsList.length
    } else {
      var qua = this.cartEl.quantity
    }

    switch (action) {
      case 'minus':
        if (this.cartEl.extra > 0) {
          this.cartEl.extra--
        }
        var extraQua: number = this.calculateService.multipleQuantity(qua, this.appConfig.data.extraPrice)
        this.cartEl.price = this.calculateService.minusElements(this.cartEl.price, extraQua)
        break;
      case 'plus':
        this.cartEl.extra++
        var extraQua: number = this.calculateService.multipleQuantity(qua, this.appConfig.data.extraPrice)
        this.cartEl.price = this.calculateService.plusElements(this.cartEl.price, extraQua)
        break;
    }
    this.emitChange.emit({ cartEl: this.cartEl, date: new Date(), index: this.offsetIndex });
  }

  extraChangeSimple(action: 'plus' | 'minus') {
    var extraPrice: number = this.appConfig.data.extraPrice
    if (this.existOrder) {
      extraPrice = this.oneExtraPrice
    }

    switch (action) {
      case 'minus':
        if (this.cartEl.extra > 0) {
          this.cartEl.extra--
          this.cartEl.price = this.calculateService.minusElements(this.cartEl.price, extraPrice)
        }
        break;
      case 'plus':
        this.cartEl.extra++
        this.cartEl.price = this.calculateService.plusElements(this.cartEl.price, extraPrice)
        break;
    }
    this.emitChange.emit({ cartEl: this.cartEl, date: new Date(), index: this.offsetIndex });
  }


  changeSpecialPrice() {
    const options: ModalDialogOptions = {
      context: {
        cartEl: this.cartEl
      },
      viewContainerRef: this.viewContainerRef,
      fullscreen: true,
    };
    this.modalService
      .showModal(ChangePriceComponent, options)
      .then((r: boolean | number) => {
        if (r) {
          this.cartEl.pricePerOne = this.calculateService.stringToNumber(<number>r)
          this.cartEl.price = this.calculateService.multipleQuantity(this.cartEl.quantity, <number>r)
          this.emitChange.emit({ cartEl: this.cartEl, date: new Date(), index: this.offsetIndex });
        }
      });
  }

  changeServeType() {
    this.cartEl.serveType = (this.cartEl.serveType == ServeType.plate) ? ServeType.pack : ServeType.plate
    this.emitChange.emit({ cartEl: this.cartEl, date: new Date(), index: this.offsetIndex });
  }

  changeSea() {
    this.cartEl.isSea = (this.cartEl.isSea) ? false : true
    this.emitChange.emit({ cartEl: this.cartEl, date: new Date(), index: this.offsetIndex });
  }

  changeAcc(event: AccElement[]) {
    this.cartEl.acc = event
    this.emitChange.emit({ cartEl: this.cartEl, date: new Date(), index: this.offsetIndex });
  }


  // selectAcc(acc: AccElement, i: number) {
  //   let options = {
  //     title: "Ilość dodatkowego " + acc.acc.name + ".",
  //     message: "",
  //     cancelButtonText: "Anuluj",
  //     actions: this.countArray,
  //   };
  //   action(options).then((result: string) => {
  //     if (result != "Anuluj") {
  //       this.cartEl.acc[i].howMany = parseInt(result);
  //       this.emitChange.emit({ cartEl: this.cartEl, date: new Date(), index: this.offsetIndex });
  //     }
  //   });
  // }

  // reduceAccAfterQuantityChange() {
  //   this.cartEl.acc.map((a: AccElement, i) => {
  //     if (this.cartEl.quantity < a.howMany) {
  //       this.cartEl.acc[i].howMany = this.cartEl.quantity
  //     }
  //   })
  // }

  changeOnOnePlate() {
    this.cartEl.onOnePlate = (this.cartEl.onOnePlate) ? false : true
    this.emitChange.emit({ cartEl: this.cartEl, date: new Date(), index: this.offsetIndex });
  }

  showOptions() {
    const options: ModalDialogOptions = {
      context: {
        element: this.cartEl.element,
        index: this.cartEl.ind.index,
        quantity: this.cartEl.quantity,
        optionsElements: this.cartEl.optionsElements,
      },
      viewContainerRef: this.viewContainerRef,
      fullscreen: false,
    };
    this.modalService
      .showModal(OptionsElementChangeComponent, options)
      .then((r) => {
        this.emitChange.emit({ cartEl: this.cartEl, date: new Date(), index: this.offsetIndex });
      });
  }

  showDesc() {
    const options: ModalDialogOptions = {
      context: {
        currentElements: this.cartEl.descElements,
        baseElementsGroups: this.elementOptions.desc,
      },
      viewContainerRef: this.viewContainerRef,
      fullscreen: true,
    };
    this.modalService.showModal(SuggestDescComponent, options).then((r) => {
      this.emitChange.emit({ cartEl: this.cartEl, date: new Date(), index: this.offsetIndex });
    });
  }

  removeDescEl(i: number) {
    this.cartEl.descElements.splice(i, 1);
    this.emitChange.emit({ cartEl: this.cartEl, date: new Date(), index: this.offsetIndex });
  }

  removePlusEl(i: number) {
    var el: PlusElement = this.cartEl.plusElements[i];
    this.cartEl.plusElements.splice(i, 1);
    this.cartEl.price = this.calculateService.minusElements(this.cartEl.price, el.price);
    this.emitChange.emit({ cartEl: this.cartEl, date: new Date(), index: this.offsetIndex });
  }

  removePlusStep(i: number, j: number) {
    this.cartEl.plusElements[i].stepOptionsList.splice(j, 1)
    if (this.cartEl.plusElements[i].stepOptionsList.length == 0) {
      this.cartEl.plusElements.splice(i, 1)
      this.priceChange();
      this.emitChange.emit({ cartEl: this.cartEl, date: new Date(), index: this.offsetIndex });
      return
    }
    var ps: Array<number | string> = []
    this.cartEl.plusElements[i].stepOptionsList.map(p => {
      ps.push(p.pricePerOne)
    })
    let price: number = this.calculateService.pricePlusMapElements(0, ps)
    this.cartEl.plusElements[i].price = price
    this.cartEl.plusElements[i].pricePerOne = price
    this.priceChange();
    this.emitChange.emit({ cartEl: this.cartEl, date: new Date(), index: this.offsetIndex });
  }


  removePlusOption(i: number, j: number) {
    if (this.cartEl.plusElements[i].qunatity == 1) {
      this.cartEl.plusElements.splice(i, 1)
      this.priceChange();
      this.emitChange.emit({ cartEl: this.cartEl, date: new Date(), index: this.offsetIndex });
      return;
    }
    this.cartEl.plusElements[i].qunatity--
    this.cartEl.plusElements[i].price = this.calculateService.multipleQuantity(this.cartEl.plusElements[i].qunatity, this.cartEl.plusElements[i].pricePerOne)
    this.cartEl.plusElements[i].optionsElements.splice(j, 1)
    this.priceChange();
    this.emitChange.emit({ cartEl: this.cartEl, date: new Date(), index: this.offsetIndex });
  }

  showPlus() {
    const options: ModalDialogOptions = {
      context: {
        plusCartCategories: this.plusCartCategories,
        basePlusElements: this.cartEl.plusElements,
        elementOptions: this.elementOptions
      },
      viewContainerRef: this.viewContainerRef,
      fullscreen: true,
    };
    this.modalService.showModal(PlusElementsComponent, options).then((r) => {
      this.cartEl.plusElements = r;
      this.priceChange();
    });
  }


  priceChange() {
    this.cartEl.price = this.calculateService.stringToNumber(this.cartEl.pricePerOne);
    var ps: Array<string | number> = []
    this.cartEl.plusElements.map((plus) => {
      ps.push(plus.price)
    });
    this.cartEl.price = this.calculateService.pricePlusMapElements(this.cartEl.price, ps)
    this.emitChange.emit({ cartEl: this.cartEl, date: new Date(), index: this.offsetIndex });
  }

  showReverse() {
    const options: ModalDialogOptions = {
      context: {
        reverseCartElements: this.cartEl.reverseElements,
        baseReverseElements: this.elementOptions.reverse,
      },
      viewContainerRef: this.viewContainerRef,
      fullscreen: true,
    };
    this.modalService.showModal(ReverseDescComponent, options).then((r) => {
      this.emitChange.emit({ cartEl: this.cartEl, date: new Date(), index: this.offsetIndex });
    });
  }

  removeReverse(i: number) {
    this.cartEl.reverseElements.splice(i, 1);
    this.emitChange.emit({ cartEl: this.cartEl, date: new Date(), index: this.offsetIndex });
  }

  remove() {
    // console.log(this.cartEl.id)
    this.emitRemove.emit({ cartEl: this.cartEl, index: this.offsetIndex });
  }

  changeSeaDouble() {
    switch (this.cartEl.elementType) {

      case ElementMenuType.oneName:

        var newPricePerOne: number = 0

        if (this.cartEl.isSea) {
          this.cartEl.element.price.map(p => {
            if (!p.isSea) {
              newPricePerOne = this.calculateService.stringToNumber(p.price)
            }
          })
          this.cartEl.isSea = false
        } else {
          this.cartEl.element.price.map(p => {
            if (p.isSea) {

              newPricePerOne = this.calculateService.stringToNumber(p.price)
            }
          })
          this.cartEl.isSea = true
        }

        var newPrice: number = this.cartService.calcPriceExceptPlusAndExtra(this.cartEl.quantity, newPricePerOne, this.cartEl.pricePerOne, this.cartEl.price)
        this.cartEl.pricePerOne = newPricePerOne
        this.cartEl.price = newPrice

        break
      case ElementMenuType.manyNames:

        var newPricePerOne: number = 0

        if (this.cartEl.isSea) {
          this.cartEl.element.priceNames[this.cartEl.ind.priceNameIndex].price.map(p => {
            if (!p.isSea) {
              newPricePerOne = this.calculateService.stringToNumber(p.price)
            }
          })
          this.cartEl.isSea = false
        } else {
          this.cartEl.element.priceNames[this.cartEl.ind.priceNameIndex].price.map(p => {
            if (p.isSea) {
              newPricePerOne = this.calculateService.stringToNumber(p.price)
            }
          })
          this.cartEl.isSea = true
        }

        var newPrice: number = this.cartService.calcPriceExceptPlusAndExtra(this.cartEl.quantity, newPricePerOne, this.cartEl.pricePerOne, this.cartEl.price)
        this.cartEl.pricePerOne = newPricePerOne
        this.cartEl.price = newPrice

        break;

      case ElementMenuType.descElements:

        var newPricePerOne: number = 0

        if (this.cartEl.isSea) {
          newPricePerOne = this.calculateService.stringToNumber(this.cartEl.element.descElements[this.cartEl.ind.index].price)
          this.cartEl.isSea = false
        } else {
          newPricePerOne = this.calculateService.stringToNumber(this.cartEl.element.descElements[this.cartEl.ind.index].seaPrice)
          this.cartEl.isSea = true
        }

        var newPrice: number = this.cartService.calcPriceExceptPlusAndExtra(this.cartEl.quantity, newPricePerOne, this.cartEl.pricePerOne, this.cartEl.price)
        this.cartEl.pricePerOne = newPricePerOne
        this.cartEl.price = newPrice

        break

    }

    this.emitChange.emit({ cartEl: this.cartEl, date: new Date(), index: this.offsetIndex });

  }

  checkIsHasDoubleSea() {
    switch (this.cartEl.elementType) {
      case ElementMenuType.oneName:
        var isSea: boolean = false;
        this.cartEl.element.price.map(p => {
          if (p.isSea) {
            isSea = true
          }
        })

        if (this.cartEl.element.price.length > 1 && isSea) {
          this.seaDouble = true
        }

        break
      case ElementMenuType.manyNames:

        var isSea: boolean = false;

        this.cartEl.element.priceNames[this.cartEl.ind.priceNameIndex].price.map(p => {
          if (p.isSea) {
            isSea = true
          }
        })


        if (this.cartEl.element.priceNames[this.cartEl.ind.priceNameIndex].price.length > 1 && isSea) {
          this.seaDouble = true
        }


        break;

      case ElementMenuType.descElements:

        if (this.cartEl.element.descElements[this.cartEl.ind.index].price != "" && this.cartEl.element.descElements[this.cartEl.ind.index].seaPrice != "") {
          this.seaDouble = true
        }


        break

      case ElementMenuType.configPrice:


        break

      case ElementMenuType.configStepsPrice:


        break

      case ElementMenuType.configStepsPriceMany:


        break
    }

  }

  ngOnDestroy(): void {
    if (this.subChange) this.subChange.unsubscribe();
    if (this.subOrientChange) this.subOrientChange.unsubscribe()
    if (this.subAccChange) this.subAccChange.unsubscribe()
  }
}
