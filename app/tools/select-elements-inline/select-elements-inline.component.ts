import { AfterContentInit } from '@angular/core';
import { TokenBase } from './../../models/token-base';
import { OrderStatus } from './../../models/cart-order';
import { OrderQueryParams } from '~/models/order-query-params';
import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectorRef, OnChanges, SimpleChanges } from '@angular/core';
import { Device, device } from "platform";
import { screen } from "tns-core-modules/platform";
import { on } from "tns-core-modules/application";
import { DEFAULT_ORDERS_QUERY_PARAMS } from '~/config';

@Component({
  selector: 'app-select-elements-inline',
  templateUrl: './select-elements-inline.component.html',
  styleUrls: ['./select-elements-inline.component.scss']
})
export class SelectElementsInlineComponent implements OnInit, OnChanges, AfterContentInit {

  // @Output() emitSelected: EventEmitter<string[]> = new EventEmitter<string[]>()
  @Output() emitSelected: EventEmitter<{ sts: string[], paid: 'all' | '0' | '1' | 'none', reservation: '0' | '1' | 'all', inProgress: '0' | '1' | 'all' }>
    = new EventEmitter<{ sts: string[], paid: 'all' | '0' | '1' | 'none', reservation: '0' | '1' | 'all', inProgress: '0' | '1' | 'all' }>()
  @Input() options: Array<{ name: string, value: string, selected?: boolean }> = []
  @Input() selectedOptions: string[] = []
  @Input() oQP: OrderQueryParams
  @Input() reservations: number = 0
  @Input() archives: number = 0
  @Input() inProgress: number = 0
  @Input() tokenUser: TokenBase
  isAll: boolean = false
  orderStatus = OrderStatus
  device: Device = device
  orient: string
  saveOQPState: OrderQueryParams

  inProgressSteps: Array<'0' | '1' | 'all'> = ['0', '1', 'all']
  inProgressStepsIndex: number
  reservationsSteps: Array<'0' | '1' | 'all'> = ['0', '1', 'all']
  reservationsStepsIndex: number
  paidSteps: Array<'0' | '1' | 'all'> = ['0', '1', 'all']
  paidStepsIndex: number

  constructor(private _changeDetectionRef: ChangeDetectorRef) { }

  ngAfterContentInit(): void {
    if (this.tokenUser.user.role == 'admin') {
      this.saveOQPState = Object.assign({}, DEFAULT_ORDERS_QUERY_PARAMS)
    } else {
      this.saveOQPState = Object.assign({}, this.oQP)
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.oQP.firstChange) {
      this.inProgressStepsIndex = this.findIndex(this.inProgressSteps, changes.oQP.currentValue.inprogress)
      this.reservationsStepsIndex = this.findIndex(this.reservationsSteps, changes.oQP.currentValue.reservation)
      this.paidStepsIndex = this.findIndex(this.reservationsSteps, changes.oQP.currentValue.reservation)
    }
  }

  ngOnInit(): void {
    this.setActiveSelect()
  }


  // changePaid(event: 'all' | '0' | '1' | 'none') {
  //   this.oQP.paid = event
  //   this.saveQueryParamsState()
  //   this.emitSelected.emit({ sts: this.selectedOptions, paid: event, reservation: this.oQP.reservation, inProgress: this.oQP.inprogress })
  // }




  setActiveSelect() {
    this.options.map((o, i) => {
      this.selectedOptions.map(so => {
        if (o.value == so) {
          this.options[i].selected = true
        }
      })
    })
  }


  changeInProgress() {

    // if (this.oQP.reservation == '1')
    //   return
    if (this.oQP.reservation == '1')
      this.oQP.reservation = 'all'

    var stepsLength: number = this.inProgressSteps.length
    if ((this.inProgressStepsIndex + 1) == stepsLength) {
      this.inProgressStepsIndex = 0
    } else {
      this.inProgressStepsIndex++
    }
    this.oQP.inprogress = this.inProgressSteps[this.inProgressStepsIndex]
    this.saveOQPState.inprogress = this.inProgressSteps[this.inProgressStepsIndex]
    var { inprogress, ...rest } = DEFAULT_ORDERS_QUERY_PARAMS

    switch (this.oQP.inprogress) {
      case '0':
        this.oQP = { ...this.oQP, ...rest }
        this.selectedOptions = this.oQP.sts.split('|')
        this.saveQueryParamsState()
        break;
      case '1':
        this.selectedOptions = []
        this.oQP.paid = '0'
        this.oQP.reservation = '0'
        break;
      case 'all':
        this.oQP = { ...this.oQP, ...rest }
        this.selectedOptions = this.oQP.sts.split('|')
        this.saveQueryParamsState()
        break;
    }

    this.setOptionsFromSelectOptionsArray()
    this.setStatusIndexes()
    this.emitSelected.emit({ sts: this.selectedOptions, paid: this.oQP.paid, reservation: this.oQP.reservation, inProgress: this.oQP.inprogress })
  }


  changePaid() {
    // if (this.oQP.inprogress == '1' || this.oQP.reservation == '1')
    //   return

    var stepsLength: number = this.paidSteps.length
    if ((this.paidStepsIndex + 1) == stepsLength) {
      this.paidStepsIndex = 0
    } else {
      this.paidStepsIndex++
    }

    this.oQP.paid = this.paidSteps[this.paidStepsIndex]
    this.saveOQPState.paid = this.paidSteps[this.paidStepsIndex]
    this.selectedOptions = this.oQP.sts.split('|')
    this.oQP.inprogress = this.oQP.inprogress
    this.saveQueryParamsState()
    this.setOptionsFromSelectOptionsArray()

    this.emitSelected.emit({ sts: this.selectedOptions, paid: this.oQP.paid, reservation: this.oQP.reservation, inProgress: this.oQP.inprogress })
  }



  selectUnselect(i: number) {

    // if (this.oQP.inprogress == '1' || this.oQP.reservation == '1')
    //   return

    this.options[i].selected = (this.options[i].selected) ? false : true
    this.createSelectedOptions()

    if (this.selectedOptions.length == 0 || this.selectedOptions.length != this.options.length)
      this.isAll = false
    else
      this.isAll = true

    this.oQP.inprogress = 'all'
    this.saveQueryParamsState()
    this.emitSelected.emit({ sts: this.selectedOptions, paid: this.oQP.paid, reservation: this.oQP.reservation, inProgress: this.oQP.inprogress })
  }

  createSelectedOptions() {
    this.selectedOptions = []
    this.options.map(op => {
      if (op.selected) {
        this.selectedOptions.push(op.value)
      }
    })
  }

  setOptionsFromSelectOptionsArray() {
    this.options.map((op: { name: string, value: string, selected?: boolean }, i: number) => {
      var isInArray: boolean = false
      this.selectedOptions.map((s) => {
        if (s == op.value) {
          isInArray = true
        }
      })
      if (isInArray) {
        this.options[i].selected = true
      } else {
        this.options[i].selected = false
      }
    })
  }


  changeReservation() {

    // if (this.oQP.inprogress == '1')
    //   return

    if (this.oQP.inprogress == '1')
      this.oQP.inprogress = 'all'

    var stepsLength: number = this.reservationsSteps.length
    if ((this.reservationsStepsIndex + 1) == stepsLength) {
      this.reservationsStepsIndex = 0
    } else {
      this.reservationsStepsIndex++
    }
    this.oQP.reservation = this.reservationsSteps[this.reservationsStepsIndex]
    this.saveOQPState.reservation = this.reservationsSteps[this.reservationsStepsIndex]
    this.selectedOptions = this.oQP.sts.split('|')
    this.oQP.inprogress = this.oQP.inprogress
    this.saveQueryParamsState()
    this.setOptionsFromSelectOptionsArray()
    this.setStatusIndexes()
    this.emitSelected.emit({ sts: this.selectedOptions, paid: this.oQP.paid, reservation: this.oQP.reservation, inProgress: this.oQP.inprogress })


  }

  selectAll() {
    this.selectedOptions = []
    this.options.map(op => {
      this.selectedOptions.push(op.value)
    })
    this.oQP.paid = 'all'
    this.oQP.reservation = 'all'
    this.oQP.inprogress = 'all'
    this.setActiveSelect()
    this.isAll = true
    this.saveQueryParamsState()
    this.setStatusIndexes()
    this.emitSelected.emit({ sts: this.selectedOptions, paid: this.oQP.paid, reservation: this.oQP.reservation, inProgress: this.oQP.inprogress })
  }

  clearAll() {
    this.selectedOptions = []
    this.options.map((o, i) => { this.options[i].selected = false })
    this.isAll = false
    this.oQP.paid = '0'
    this.oQP.reservation = '0'
    this.oQP.inprogress = '0'
    this.saveQueryParamsState()
    this.setStatusIndexes()
    this.emitSelected.emit({ sts: this.selectedOptions, paid: this.oQP.paid, reservation: this.oQP.reservation, inProgress: this.oQP.inprogress })
  }

  saveQueryParamsState() {
    this.saveOQPState = { ...this.saveOQPState, ...this.oQP }
  }


  findIndex(sts: string[], st: string): number {
    var index: number
    sts.map((s, i) => {
      if (s == st) {
        index = i
      }
    })
    return index
  }


  setStatusIndexes() {
    this.inProgressStepsIndex = this.findIndex(this.inProgressSteps, this.oQP.inprogress)
    this.reservationsStepsIndex = this.findIndex(this.reservationsSteps, this.oQP.reservation)
    this.paidStepsIndex = this.findIndex(this.reservationsSteps, this.oQP.reservation)
  }

}
