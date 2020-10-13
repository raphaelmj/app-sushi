import { CalculateService } from './../../services/calculate/calculate.service';
import { AppConfig } from './../../models/app-config';
import { StepOneTwo } from './../config-step-options/config-step-options.component';
import { MenuElement, ElementConfigStepsPrice, ElementConfigStepsPriceType } from './../../models/menu-element';
import { CartElement } from '~/models/cart-element';
import { CartService } from '~/services/cart.service';
import { ModalDialogParams } from '@nativescript/angular';
import { Component, OnInit } from '@angular/core';
import { StepOptionsListElement } from '~/models/cart-element';

@Component({
  selector: 'app-edit-many-step-options',
  templateUrl: './edit-many-step-options.component.html',
  styleUrls: ['./edit-many-step-options.component.scss']
})
export class EditManyStepOptionsComponent implements OnInit {

  stepOptionsList: StepOptionsListElement[] = []
  cartElement: CartElement
  element: MenuElement
  configFirstIndex: number = 0
  configSecondIndex: number = 0
  configThirdIndex: number = 0
  priceCurrent: number = 0
  mergeSteps: StepOneTwo[] = []
  appConfig: AppConfig

  constructor(
    private params: ModalDialogParams,
    private cartService: CartService,
    private calculateService: CalculateService
  ) {
    this.appConfig = this.params.context.appConfig
    this.cartElement = this.params.context.cartEl
    this.stepOptionsList = this.cartElement.stepOptionsList
    this.element = this.cartElement.element
    let stepListElement: StepOptionsListElement = { configFirstIndex: this.configFirstIndex, configSecondIndex: this.configSecondIndex, configThirdIndex: this.configThirdIndex }
    this.priceCurrent = this.cartService.findPriceFromOneStepOptionsList(stepListElement, this.element.configStepsPrice)
  }

  ngOnInit(): void {
    if (!this.element.skipStepOne) {
      this.findPriceCurrent()
    } else {
      this.mergeStepOneAndTwo()
    }
    this.findPriceCurrent()
  }

  selectFirstType(i: number) {
    this.configFirstIndex = i
    this.configSecondIndex = 0
    this.configThirdIndex = 0
    this.findPriceCurrent()
  }

  selectSecondType(i: number) {
    this.configSecondIndex = i
    this.configThirdIndex = 0
    this.findPriceCurrent()
  }

  selectThirdType(i: number) {
    this.configThirdIndex = i
    this.findPriceCurrent()
  }

  findPriceCurrent() {
    if (this.cartElement.element.configStepsPrice.length > 0) {
      if (this.element.configStepsPrice[this.configFirstIndex].types.length > 0) {
        if (this.element.configStepsPrice[this.configFirstIndex].types[this.configSecondIndex].options.length > 0) {
          this.priceCurrent = Number(this.element.configStepsPrice[this.configFirstIndex].types[this.configSecondIndex].options[this.configThirdIndex].price)
        }
      }
    }
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

  addStepOption() {
    // let priceBefore: number = 0
    // priceBefore += this.cartElement.price
    // let perOnePriceBefore = 0
    // perOnePriceBefore += this.cartElement.pricePerOne
    var extraPriceBefore: number = 0
    var extra: number = this.calculateService.multipleValues(this.cartElement.extra, this.appConfig.data.extraPrice)
    var extraAll: number = this.calculateService.multipleValues(this.stepOptionsList.length, extra)
    extraPriceBefore = this.calculateService.plusElements(extraAll, extraPriceBefore)
    var { priceCurrent, isSea } = this.findPriceAndSeaBySteps(this.configFirstIndex, this.configSecondIndex, this.configSecondIndex)
    this.stepOptionsList.push({
      configFirstIndex: this.configFirstIndex,
      configSecondIndex: this.configSecondIndex,
      configThirdIndex: this.configThirdIndex,
      pricePerOne: this.priceCurrent
    })
    var extraPlus: number = this.calculateService.multipleQuantity(this.cartElement.extra, this.appConfig.data.extraPrice)
    var newExtra: number = this.calculateService.plusElements(extraPriceBefore, extraPlus)
    this.cartElement.pricePerOne = this.calculateService.plusElements(this.cartElement.pricePerOne, priceCurrent)
    this.cartElement.price = this.calculateService.minusElements(this.cartElement.price, extraPriceBefore)
    this.cartElement.price = this.calculateService.plusElements(this.cartElement.price, this.calculateService.plusElements(priceCurrent, newExtra))


    // var div: number = priceBefore - perOnePriceBefore
    // this.cartElement.price = this.cartElement.pricePerOne + div
  }

  removeStepOption(i: number) {
    var extraPriceBefore: number = 0
    var extra: number = this.calculateService.multipleValues(this.cartElement.extra, this.appConfig.data.extraPrice)
    var extraAll: number = this.calculateService.multipleValues(extra, this.stepOptionsList.length)
    extraPriceBefore = this.calculateService.plusElements(extraPriceBefore, extraAll)
    var step: StepOptionsListElement = this.stepOptionsList[i]
    var { priceCurrent, isSea } = this.findPriceAndSeaBySteps(step.configFirstIndex, step.configSecondIndex, step.configThirdIndex)
    this.stepOptionsList.splice(i, 1)

    this.cartElement.price = this.calculateService.minusElements(this.cartElement.price, extraPriceBefore)
    this.cartElement.pricePerOne = this.calculateService.minusElements(this.cartElement.pricePerOne, priceCurrent)
    this.cartElement.price = this.calculateService.minusElements(this.cartElement.price, priceCurrent)
    var extraPlus: number = this.calculateService.multipleQuantity(this.cartElement.extra, this.appConfig.data.extraPrice)
    var newExtraPrice: number = this.calculateService.multipleQuantity(extraPlus, this.stepOptionsList.length)
    this.cartElement.price = this.calculateService.plusElements(this.cartElement.price, newExtraPrice)
  }

  findPriceAndSeaBySteps(configFirstIndex: number, configSecondIndex: number, configThirdIndex: number): { priceCurrent: number, isSea: boolean } {
    var priceCurrent: number = 0
    var isSea: boolean = false
    if (this.element.configStepsPrice[configFirstIndex].types.length > 0) {
      if (this.element.configStepsPrice[configFirstIndex].types[configSecondIndex].options.length > 0) {
        priceCurrent = Number(this.element.configStepsPrice[configFirstIndex].types[configSecondIndex].options[configThirdIndex].price)
        isSea = this.element.configStepsPrice[configFirstIndex].types[configSecondIndex].options[configThirdIndex].isSea
      }
    }
    return { priceCurrent, isSea }
  }

  close() {
    this.params.closeCallback(this.stepOptionsList)
  }

}
