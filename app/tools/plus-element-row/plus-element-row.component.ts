import { OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { OrientationChangeService } from './../../services/orientation-change.service';
import { ElementType } from './../../models/cart-element';
import { ChangeDetectorRef, EventEmitter } from '@angular/core';
import { PlusElement } from '~/models/cart-element';
import { Component, OnInit, Input, Output } from '@angular/core';
import { Device, screen } from "tns-core-modules/platform";
import { on } from "tns-core-modules/application";
import { device } from "platform";
import { Orientation } from 'tns-core-modules/ui/layouts/stack-layout';

@Component({
  selector: 'app-plus-element-row',
  templateUrl: './plus-element-row.component.html',
  styleUrls: ['./plus-element-row.component.scss']
})
export class PlusElementRowComponent implements OnInit, OnDestroy {

  @Output() emitRemove: EventEmitter<number> = new EventEmitter<number>()
  @Output() emitRemoveStep: EventEmitter<{ index: number, indexStep: number }> = new EventEmitter<{ index: number, indexStep: number }>()
  @Output() emitRemoveOption: EventEmitter<{ index: number, indexOption: number }> = new EventEmitter<{ index: number, indexOption: number }>()
  @Input() plusElement: PlusElement
  @Input() index: number
  elementType = ElementType
  device: Device = device
  orient: Orientation
  rowWidth: string
  subOrientChange: Subscription

  constructor(private _changeDetectionRef: ChangeDetectorRef, private orientationChangeService: OrientationChangeService) {
    this.orient = (screen.mainScreen.widthDIPs > screen.mainScreen.heightDIPs) ? "horizontal" : "vertical"
  }


  ngOnInit(): void {
    this.subscribeToOrientChange()
    this.orientationChangeService.changeEmit()
  }

  subscribeToOrientChange() {
    this.subOrientChange = this.orientationChangeService.action$.subscribe((data: { orient: Orientation, deviceType: 'Phone' | 'Tablet', width?: number }) => {
      this.orient = data.orient
      this.setRowWidth()
      this._changeDetectionRef.detectChanges()
    })
  }


  setRowWidth() {
    if ((this.plusElement.elementType == ElementType.configStepsPriceMany || this.plusElement.elementType == ElementType.configStepsPrice) || this.plusElement.optionsElements.length > 0) {
      this.rowWidth = '100%'
    } else {
      switch (this.device.deviceType) {
        case 'Phone':
          switch (this.orient) {
            case "horizontal":
              this.rowWidth = '100%'
              break;
            case "vertical":
              this.rowWidth = '100%'
              break;
          }
          break

        case 'Tablet':
          switch (this.orient) {
            case "horizontal":
              this.rowWidth = '50%'
              break;
            case "vertical":
              this.rowWidth = '100%'
              break;
          }
          break
      }
    }
  }

  removeStep(i: number) {
    this.emitRemoveStep.emit({ index: this.index, indexStep: i })
  }

  removeOptionElement(i: number) {
    this.emitRemoveOption.emit({ index: this.index, indexOption: i })
  }

  remove() {
    this.emitRemove.emit(this.index)
  }

  ngOnDestroy(): void {
    if (this.subOrientChange)
      this.subOrientChange.unsubscribe()
  }

}
