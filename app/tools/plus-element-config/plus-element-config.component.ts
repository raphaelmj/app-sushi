import { CalculateService } from './../../services/calculate/calculate.service';
import { StepOptionsListElement } from './../../models/cart-element';
import { ReverseOptions } from '~/models/reverse-options';
import { DescOptions } from '~/models/desc-options';
import { EventEmitter } from '@angular/core';
import { CartService } from '~/services/cart.service';
import { ServeType, ReverseElement, PlusElement } from '~/models/cart-element';
import { PriceConfigSort } from '~/models/price-config-sort';
import { ElementMenuType } from '~/models/site';
import { FormGroup } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { MenuElement } from '~/models/menu-element';
import { Component, OnInit, Input, Output } from '@angular/core';
import { action } from "tns-core-modules/ui/dialogs";
import { screen } from "tns-core-modules/platform";
import { on } from "tns-core-modules/application";

@Component({
  selector: 'app-plus-element-config',
  templateUrl: './plus-element-config.component.html',
  styleUrls: ['./plus-element-config.component.scss']
})
export class PlusElementConfigComponent implements OnInit {

  @Output() emitClose: EventEmitter<boolean> = new EventEmitter<boolean>()
  @Output() emitAdd: EventEmitter<PlusElement> = new EventEmitter<PlusElement>()
  @Input() elementOptions: { desc: DescOptions[]; reverse: ReverseOptions[] }
  @Input() element: MenuElement
  @Input() index: number | null
  @Input() priceNameIndex: number | null

  formData: FormGroup
  grill: number = 0
  gluten: number = 0
  isSea: boolean = false
  hasSea: boolean = false
  priceConfigSort: PriceConfigSort[]
  priceTotal: number
  pricePerOne: number
  countArray: Array<string> = [];
  countHalfArray: Array<string> = [];
  configFirstIndex: number | null = null
  configSecondIndex: number | null = null
  configThirdIndex: number | null = null
  pricesCount: number = 1
  selectedIndex: number = 0
  serveType: ServeType
  extra: number = 0
  optionsElements: string[] = []
  options: string[] = []
  descElements: string[] = []
  reverseElements: ReverseElement[] = []
  stepOptionsList: StepOptionsListElement[] = []

  scrollHeight: number = Math.ceil(screen.mainScreen.heightDIPs) - 260;



  constructor(
    private fb: FormBuilder,
    private cartService: CartService,
    private calculateService: CalculateService) { }

  ngOnInit(): void {
    this.formData = this.fb.group({
      description: [''],
      quantity: [1],
    })
    this.initViewDataOptions()
    this.priceMake()
    this.makeCountArray()
    this.makeCountHalfArray()
    this.options = this.cartService.findOptionsByType(this.element, this.index)
  }

  onSelectedIndexchanged($event) {

  }

  priceMake() {
    this.findPricePerOne()
    this.priceTotal = this.calculateService.multipleQuantity(this.formData.get("quantity").value, this.pricePerOne);
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

      case ElementMenuType.configStepsPrice:
        var stepOptions: StepOptionsListElement = {
          configFirstIndex: this.configFirstIndex,
          configSecondIndex: this.configSecondIndex,
          configThirdIndex: this.configThirdIndex
        }
        this.pricePerOne = this.cartService.findPriceFromOneStepOptionsList(stepOptions, this.element.configStepsPrice)
        stepOptions.pricePerOne = this.pricePerOne
        break

      case ElementMenuType.configStepsPriceMany:

        var stepOptions: StepOptionsListElement = {
          configFirstIndex: this.configFirstIndex,
          configSecondIndex: this.configSecondIndex,
          configThirdIndex: this.configThirdIndex
        }
        this.pricePerOne = this.cartService.findPriceFromOneStepOptionsList(stepOptions, this.element.configStepsPrice)
        stepOptions.pricePerOne = this.pricePerOne
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

      case ElementMenuType.configStepsPrice:
        this.configFirstIndex = 0;
        this.configSecondIndex = 0;
        this.configThirdIndex = 0;
        break

      case ElementMenuType.configStepsPriceMany:
        this.configFirstIndex = 0;
        this.configSecondIndex = 0;
        this.configThirdIndex = 0;
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

    if (this.formData.get('quantity').value < this.optionsElements.length) {
      this.optionsElements.splice(this.optionsElements.length - 1, 1)
    }

    this.makeCountArray()
    this.makeCountHalfArray()
    this.priceTotal = this.calculateService.multipleQuantity(currentValue, this.pricePerOne);

  }

  addOptions(p: string) {
    if (this.formData.get('quantity').value > this.optionsElements.length) {
      this.optionsElements.push(p)
    }
  }

  removeOption(i: number) {
    this.optionsElements.splice(i, 1)
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



  changeConfigElement(event: { index: number, isSea: boolean }) {
    this.index = event.index
    this.isSea = event.isSea
    this.priceMake()
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


  changeReverse(event: ReverseElement[]) {

  }

  changeDesc(event: string[]) {

  }

  close() {
    this.emitClose.emit(false)
  }

  add() {
    if (this.element.elementType == ElementMenuType.configStepsPriceMany) {
      if (this.stepOptionsList.length < 1) {
        return;
      }
    }
    if (this.element.options.length > 0 && (this.element.elementType != 'config_steps_price' && this.element.elementType != 'config_steps_price_many')) {
      if (this.optionsElements.length != this.formData.get('quantity').value) {
        return;
      }
    }
    var pe: PlusElement = this.preparePlusElement()
    this.emitAdd.emit(pe)
  }

  preparePlusElement(): PlusElement {
    var pe: PlusElement = {
      id: this.element.id,
      elementType: this.element.elementType,
      ind: { id: this.element.id, index: this.index, priceNameIndex: this.priceNameIndex, configFirstIndex: this.configFirstIndex, configSecondIndex: this.configSecondIndex, configThirdIndex: this.configThirdIndex },
      viewName: this.cartService.createName(this.element, this.index, this.priceNameIndex, this.configFirstIndex, this.configSecondIndex, this.configThirdIndex, this.optionsElements),
      shortName: this.cartService.createShortName(this.element, this.index, this.priceNameIndex, this.configFirstIndex, this.configSecondIndex, this.configThirdIndex, this.optionsElements),
      price: this.priceTotal,
      pricePerOne: this.pricePerOne,
      qunatity: (this.element.elementType == ElementMenuType.configStepsPriceMany) ? 1 : Number(this.formData.get('quantity').value),
      isSea: this.isSea,
      canGrill: this.element.canGrill,
      grill: this.grill,
      hasGluten: this.element.hasGluten,
      gluten: this.gluten,
      description: this.formData.get('description').value,
      optionsElements: this.optionsElements,
      reverseElements: this.reverseElements,
      descElements: this.descElements,
      stepOptionsList: this.stepOptionsList,
      configStepsPrice: this.element.configStepsPrice
    }
    return pe
  }

  changeOneTypeElement(step: StepOptionsListElement) {
    var { configFirstIndex, configSecondIndex, configThirdIndex } = step
    this.configThirdIndex = configFirstIndex
    this.configSecondIndex = configSecondIndex
    this.configThirdIndex = configThirdIndex
    this.priceMake()
  }


  pushStepElement(step: StepOptionsListElement) {

    var price: number = this.cartService.findPriceFromOneStepOptionsList(step, this.element.configStepsPrice)
    step.pricePerOne = price
    this.stepOptionsList.push(step)
    var ps: Array<number | string> = []
    this.stepOptionsList.map(s => {
      ps.push(s.pricePerOne)
    })
    this.pricePerOne = this.calculateService.pricePlusMapElements(0, ps)
    this.priceTotal = this.pricePerOne
  }

  removeStepOption(i: number) {
    var price: number = this.cartService.findPriceFromOneStepOptionsList(this.stepOptionsList[i], this.element.configStepsPrice)
    this.pricePerOne = this.calculateService.minusElements(this.pricePerOne, price)
    this.priceTotal = this.calculateService.multipleQuantity(this.formData.get("quantity").value, this.pricePerOne)
    this.stepOptionsList.splice(i, 1)
  }


}
