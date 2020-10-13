import { EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { Component, OnInit, Input, Output } from '@angular/core';
import { Device, device } from "platform";
import { screen } from "tns-core-modules/platform";

@Component({
  selector: 'app-paid-status',
  templateUrl: './paid-status.component.html',
  styleUrls: ['./paid-status.component.scss']
})
export class PaidStatusComponent implements OnInit, OnChanges {

  @Output() emitChange: EventEmitter<'all' | '0' | '1' | 'none'> = new EventEmitter<'all' | '0' | '1' | 'none'>()
  @Input() inprogress: 'all' | '0' | '1' | 'none' = 'all'
  @Input() paid: 'all' | '0' | '1' | 'none' = 'all'
  paidSts: Map<'1' | '0', boolean> = new Map([
    ['0', false],
    ['1', false]
  ])
  device: Device = device

  constructor() { }



  ngOnInit(): void {
    // this.setPaidStatusMap(this.paid)
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.paid) {
      this.paid = changes.paid.currentValue
      this.setPaidStatusMap(this.paid)
    } else {
      this.setPaidStatusMap(this.paid)
    }

  }

  setPaidStatusMap(paid: 'all' | '0' | '1' | 'none') {

    switch (paid) {
      case 'all':
        this.paidSts.set('0', true)
        this.paidSts.set('1', true)
        break;

      case '0':
        this.paidSts.set('0', true)
        this.paidSts.set('1', false)
        break
      case '1':
        this.paidSts.set('0', false)
        this.paidSts.set('1', true)
        break

      case 'none':
        this.paidSts.set('0', false)
        this.paidSts.set('1', false)
        break
    }

  }

  changePaidStatus(sts: '0' | '1') {

    if (this.inprogress != '1') {

      switch (sts) {
        case '0':
          this.paidSts.set('0', (this.paidSts.get(sts)) ? false : true)
          // this.paidSts.set('1', false)
          break
        case '1':
          this.paidSts.set('1', (this.paidSts.get(sts)) ? false : true)
          // this.paidSts.set('0', false)
          break
      }

      this.findPaidStatus()

    }

  }

  findPaidStatus() {
    var hasFalse: boolean = this.checkIsHasFalse()
    var allFalse: boolean = this.checkIsAllFalse()

    if (allFalse) {
      this.paid = 'none'
    } else if (hasFalse) {
      var withTrue: '0' | '1'
      this.paidSts.forEach((v, k) => {
        if (v) {
          withTrue = k
        }
      })
      if (withTrue)
        this.paid = withTrue
    } else {
      this.paid = 'all'
    }
    this.emitChange.emit(this.paid)
  }

  checkIsHasFalse(): boolean {
    var hasFalse: boolean = false
    this.paidSts.forEach((v, k) => {
      if (!v) {
        hasFalse = true
      }
    })
    return hasFalse
  }

  checkIsAllFalse(): boolean {
    var allFalse: boolean = true
    this.paidSts.forEach((v, k) => {
      if (v) {
        allFalse = false
      }
    })
    return allFalse
  }

}
