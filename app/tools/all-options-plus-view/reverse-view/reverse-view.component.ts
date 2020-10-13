import { OnDestroy } from '@angular/core';
import { Orientation } from 'tns-core-modules/ui/layouts/stack-layout';
import { Subscription } from 'rxjs';
import { OrientationChangeService } from './../../../services/orientation-change.service';
import { ChangeDetectorRef, EventEmitter } from '@angular/core';
import { Component, OnInit, Input, AfterContentInit, Output } from '@angular/core';
import { ReverseOptions } from '~/models/reverse-options';
import { ReverseElement } from '~/models/cart-element';
import { screen } from "tns-core-modules/platform";
import { on } from "tns-core-modules/application";

@Component({
  selector: 'app-reverse-view',
  templateUrl: './reverse-view.component.html',
  styleUrls: ['./reverse-view.component.scss']
})
export class ReverseViewComponent implements OnInit, AfterContentInit, OnDestroy {

  @Output() emitChange: EventEmitter<ReverseElement[]> = new EventEmitter<ReverseElement[]>()
  currentGroupLeft: ReverseOptions
  currentGroupRight: ReverseOptions
  scrollHeight: number
  @Input() reversWordsGroups: ReverseOptions[]
  @Input() reverseElements: ReverseElement[] = []

  gridR: string = '160,30,160'
  gridC: string = '*'
  orient: Orientation

  leftTag: string
  rightTag: string
  subOrientChange: Subscription
  initData: boolean = true

  constructor(private orientationChangeService: OrientationChangeService, private _changeDetectionRef: ChangeDetectorRef) {
    this.scrollHeight = (screen.mainScreen.heightDIPs > screen.mainScreen.widthDIPs) ? 160 : screen.mainScreen.widthDIPs - 160;
    this.orient = (screen.mainScreen.heightDIPs > screen.mainScreen.widthDIPs) ? 'vertical' : 'horizontal'
    this.changeDataByOrient(this.orient)

  }


  ngOnInit(): void {
    this.subscribeToOrientChange()
    this.orientationChangeService.changeEmit()
  }

  subscribeToOrientChange() {
    this.subOrientChange = this.orientationChangeService.action$.subscribe((data: { orient: Orientation, deviceType: 'Phone' | 'Tablet', width?: number, height?: number }) => {
      this.orient = data.orient
      // if (!this.initData)
      this.changeDataByOrient(data.orient)
      // this.initData = false
      this._changeDetectionRef.detectChanges()
    })
  }

  changeDataByOrient(orient: Orientation) {
    switch (orient) {
      case "vertical":
        // this.scrollHeight = Math.ceil(screen.mainScreen.heightDIPs) - 160;
        if (screen.mainScreen.heightDIPs > 1000) {
          this.gridR = '420,30,420'
          this.scrollHeight = 420
        } else if (screen.mainScreen.heightDIPs <= 1000 && screen.mainScreen.heightDIPs > 600) {
          this.gridR = '260,30,260'
          this.scrollHeight = 260
        } else {
          this.gridR = '160,30,160'
          this.scrollHeight = 160
        }
        this.gridC = '*'
        break
      case "horizontal":
        this.scrollHeight = Math.ceil(screen.mainScreen.widthDIPs) - 160;
        this.gridR = '*'
        if (screen.mainScreen.widthDIPs > 1000) {
          this.gridC = '*,30,320'
        } else {
          this.gridC = '*,30,220'
        }

        break;
    }
  }

  ngAfterContentInit(): void {
    this.currentGroupLeft = this.reversWordsGroups[0]
    this.currentGroupRight = this.reversWordsGroups[0]
    this._changeDetectionRef.detectChanges()
  }

  changeCategoryLeft(item: ReverseOptions) {
    this.currentGroupLeft = item
    this.changeCategoryRightIfLeftChange(item)
  }

  changeCategoryRightIfLeftChange(item: ReverseOptions) {
    this.currentGroupRight = item
  }

  changeCategoryRight(item: ReverseOptions) {
    this.currentGroupRight = item
  }

  addInfoLeft(item: string) {
    this.leftTag = item
  }

  addInfoRight(item: string) {
    this.rightTag = item
  }

  addReverse() {
    if (this.leftTag && this.rightTag) {
      this.reverseElements.push({ from: this.leftTag, to: this.rightTag })
      this.emitChange.emit(this.reverseElements)
    }
  }

  removeReverse(i) {
    this.reverseElements.splice(i, 1)
    this.emitChange.emit(this.reverseElements)
  }

  ngOnDestroy(): void {
    if (this.subOrientChange) this.subOrientChange.unsubscribe()
  }

}
