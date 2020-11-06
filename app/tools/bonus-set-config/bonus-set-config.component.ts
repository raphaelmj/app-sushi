import { BonusType } from './../../models/cart-order';
import { OrientationChangeService } from './../../services/orientation-change.service';
import { AppConfig } from '~/models/app-config';
import { CalculateService } from './../../services/calculate/calculate.service';
import { ModalDialogParams } from '@nativescript/angular';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';

export interface BonusResponseData {
  bonusType: BonusType
  currentBonusPrice: number
  currentBonusPercent: number
}

@Component({
  selector: 'app-bonus-set-config',
  templateUrl: './bonus-set-config.component.html',
  styleUrls: ['./bonus-set-config.component.scss']
})
export class BonusSetConfigComponent implements OnInit {

  total: number
  baseTotal: number
  appConfig: AppConfig
  currentBonusType: BonusType
  bonusType = BonusType
  grid: string = '120,80,80,60'
  currentBonusPrice: number
  currentBonusPercent: number

  constructor(
    private params: ModalDialogParams,
    private calculateService: CalculateService,
    private orientationChangeService: OrientationChangeService,
    private _changeDetectionRef: ChangeDetectorRef
  ) {
    this.total = this.calculateService.stringToNumber(this.params.context.total)
    this.baseTotal = this.total
    this.appConfig = this.params.context.appConfig
    this.currentBonusType = this.params.context.bonusType
    this.currentBonusPrice = this.params.context.currentBonusPrice
    this.currentBonusPercent = this.params.context.currentBonusPercent
  }

  ngOnInit(): void {
    this.changeBonusView()
    this.findBonusPrice()
  }

  changeBonusView() {
    switch (this.currentBonusType) {
      case BonusType.none:
        this.grid = '120,80,60'
        break;
      case BonusType.cart:
        this.grid = '120,80,60'
        break;
      case BonusType.percent:
        this.grid = '120,80,80,60'
        break;
    }
    this._changeDetectionRef.detectChanges()
  }

  findBonusPrice() {
    switch (this.currentBonusType) {
      case BonusType.none:
        this.total = this.baseTotal
        break;
      case BonusType.cart:
        if (this.baseTotal <= 50) {
          this.total = 0
        } else {
          this.total = this.calculateService.minusElements(this.baseTotal, this.currentBonusPrice)
        }
        break;
      case BonusType.percent:
        if (this.currentBonusPercent == 0) {
          this.total = this.baseTotal
        } else {
          var percentValue: number = this.calculateService.percentFind(this.currentBonusPercent, this.baseTotal)
          this.total = this.calculateService.minusElements(this.baseTotal, percentValue)
        }
        break;
    }
  }

  changeBonus(bType: BonusType) {
    this.currentBonusType = bType
    this.changeBonusView()
    this.findBonusPrice()
  }

  setPerecent(percent: number) {
    this.currentBonusPercent = percent
    this.findBonusPrice()
  }


  confirmBonus() {
    var bonusData: BonusResponseData = {
      bonusType: this.currentBonusType,
      currentBonusPrice: this.currentBonusPrice,
      currentBonusPercent: this.currentBonusPercent
    }
    this.params.closeCallback(bonusData)
  }

  closeExit() {
    this.params.closeCallback(false)
  }

}
