import { StepOptionsListElement } from './../../models/cart-element';
import { EventEmitter } from '@angular/core';
import { StepOneTwo } from './../config-step-options/config-step-options.component';
import { MenuElement, ElementConfigStepsPriceType, ElementConfigStepsPrice } from './../../models/menu-element';
import { Component, OnInit, Input, Output } from '@angular/core';

@Component({
  selector: 'app-three-steps-view',
  templateUrl: './three-steps-view.component.html',
  styleUrls: ['./three-steps-view.component.scss']
})
export class ThreeStepsViewComponent implements OnInit {

  @Output() emitChange: EventEmitter<StepOptionsListElement> = new EventEmitter<StepOptionsListElement>()
  @Output() addElement: EventEmitter<StepOptionsListElement> = new EventEmitter<StepOptionsListElement>()
  @Input() element: MenuElement
  @Input() hasPushBt: boolean = false
  configFirstIndex: number = 0
  configSecondIndex: number = 0
  configThirdIndex: number = 0

  mergeSteps: StepOneTwo[] = []

  constructor() { }

  ngOnInit(): void {
    if (this.element.skipStepOne) {
      this.mergeStepOneAndTwo()
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
    this.outputState()
  }

  selectFirstType(i: number) {
    this.configFirstIndex = i
    this.configSecondIndex = 0
    this.configThirdIndex = 0
    this.outputState()
  }

  selectSecondType(i: number) {
    this.configSecondIndex = i
    this.configThirdIndex = 0
    this.outputState()
  }

  selectThirdType(i: number) {
    this.configThirdIndex = i
    this.outputState()
  }

  outputState() {
    var step: StepOptionsListElement = {
      configFirstIndex: this.configFirstIndex,
      configSecondIndex: this.configSecondIndex,
      configThirdIndex: this.configThirdIndex
    }
    this.emitChange.emit(step)
  }

  pushStepElement() {
    var step: StepOptionsListElement = {
      configFirstIndex: this.configFirstIndex,
      configSecondIndex: this.configSecondIndex,
      configThirdIndex: this.configThirdIndex
    }
    this.addElement.emit(step)
  }

}
