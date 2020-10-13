import { EventEmitter } from '@angular/core';
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
export class ReverseViewComponent implements OnInit, AfterContentInit {

  @Output() emitChange: EventEmitter<ReverseElement[]> = new EventEmitter<ReverseElement[]>()
  currentGroupLeft: ReverseOptions
  currentGroupRight: ReverseOptions
  @Input() reversWordsGroups: ReverseOptions[]
  @Input() reverseElements: ReverseElement[] = []
  scrollHeight: number = Math.ceil(screen.mainScreen.widthDIPs) - 220;
  leftTag: string
  rightTag: string

  constructor() {

  }

  ngOnInit(): void {
    // this.changeOrientationObserve()
  }

  // changeOrientationObserve() {
  //   on("orientationChanged", (evt) => {
  //     switch (evt.newValue) {
  //       case "portrait":
  //         this.scrollHeight = Math.ceil(screen.mainScreen.heightDIPs) - 180;
  //         console.log(this.scrollHeight)
  //         break;

  //       case "landscape":
  //         this.scrollHeight = Math.ceil(screen.mainScreen.widthDIPs) - 180;
  //         break
  //     }

  //   });
  // }

  ngAfterContentInit(): void {
    this.currentGroupLeft = this.reversWordsGroups[0]
    this.currentGroupRight = this.reversWordsGroups[0]
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
    this.reverseElements.push({ from: this.leftTag, to: this.rightTag })
    this.emitChange.emit(this.reverseElements)
  }

  removeReverse(i) {
    this.reverseElements.splice(i, 1)
    this.emitChange.emit(this.reverseElements)
  }

}
