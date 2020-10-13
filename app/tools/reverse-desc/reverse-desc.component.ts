import { Orientation } from 'tns-core-modules/ui/layouts/stack-layout';
import { Subscription } from 'rxjs';
import { OrientationChangeService } from './../../services/orientation-change.service';
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from "@angular/core";
import { ModalDialogParams } from "@nativescript/angular";
import { ReverseOptions } from "~/models/reverse-options";
import { ReverseElement } from "~/models/cart-element";
import { screen } from "tns-core-modules/platform";
import { on } from "tns-core-modules/application";

@Component({
  selector: "app-reverse-desc",
  templateUrl: "./reverse-desc.component.html",
  styleUrls: ["./reverse-desc.component.scss"],
})
export class ReverseDescComponent implements OnInit, OnDestroy {
  currentGroupLeft: ReverseOptions;
  currentGroupRight: ReverseOptions;
  reversWordsGroups: ReverseOptions[];
  reverseElements: ReverseElement[];
  leftTag: string;
  rightTag: string;
  scrollHeight: number = Math.ceil(screen.mainScreen.heightDIPs) - 200;
  subOrientChange: Subscription
  isInitView: boolean = true
  orient: Orientation

  gridR: string = '160,30,160'
  gridC: string = '*'


  constructor(
    private params: ModalDialogParams,
    private _changeDetectionRef: ChangeDetectorRef,
    private orientationChangeService: OrientationChangeService
  ) {
    this.reverseElements = params.context.reverseCartElements;
    this.reversWordsGroups = params.context.baseReverseElements;
    this.currentGroupLeft = this.reversWordsGroups[0];
    this.currentGroupRight = this.reversWordsGroups[0];
    this.scrollHeight = (screen.mainScreen.heightDIPs > screen.mainScreen.widthDIPs) ? 160 : screen.mainScreen.widthDIPs - 200;
    this.orient = (screen.mainScreen.heightDIPs > screen.mainScreen.widthDIPs) ? 'vertical' : 'horizontal'
    this.changeDataByOrient(this.orient)
  }


  ngOnInit(): void {
    this.subscribeToOrientChange()
    this.orientationChangeService.changeEmit()
  }

  subscribeToOrientChange() {
    this.subOrientChange = this.orientationChangeService.action$.subscribe((data: { orient: Orientation, deviceType: 'Phone' | 'Tablet', width?: number }) => {
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

        this.gridR = '*'
        if (screen.mainScreen.widthDIPs > 1000) {
          this.gridC = '*,30,320'
          this.scrollHeight = Math.ceil(screen.mainScreen.widthDIPs) - 200;
        } else {
          this.gridC = '*,30,220'
          this.scrollHeight = 260;
        }

        break;
    }
  }


  changeScrollHeight(orient: Orientation) {
    switch (orient) {
      case "vertical":
        this.scrollHeight = Math.ceil(screen.mainScreen.heightDIPs) - 200;
        break
      case "horizontal":
        this.scrollHeight = Math.ceil(screen.mainScreen.widthDIPs) - 200;
        break;

    }
  }

  changeCategoryLeft(item: ReverseOptions) {
    this.currentGroupLeft = item;
    this.changeCategoryRightIfLeftChange(item)
  }

  changeCategoryRightIfLeftChange(item: ReverseOptions) {
    this.currentGroupRight = item
  }

  changeCategoryRight(item: ReverseOptions) {
    this.currentGroupRight = item;
  }

  addInfoLeft(item: string) {
    this.leftTag = item;
  }

  addInfoRight(item: string) {
    this.rightTag = item;
  }

  addReverse() {
    this.reverseElements.push({ from: this.leftTag, to: this.rightTag });
  }

  removeReverse(i) {
    this.reverseElements.splice(i, 1);
  }

  close() {
    this.params.closeCallback([]);
  }

  ngOnDestroy(): void {
    if (this.subOrientChange)
      this.subOrientChange.unsubscribe()
  }
}
