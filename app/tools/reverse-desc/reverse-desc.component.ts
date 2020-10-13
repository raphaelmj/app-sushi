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


  constructor(
    private params: ModalDialogParams,
    private _changeDetectionRef: ChangeDetectorRef,
    private orientationChangeService: OrientationChangeService
  ) {
    this.reverseElements = params.context.reverseCartElements;
    this.reversWordsGroups = params.context.baseReverseElements;
    this.currentGroupLeft = this.reversWordsGroups[0];
    this.currentGroupRight = this.reversWordsGroups[0];
  }


  ngOnInit(): void {
    this.subscribeToOrientChange()
    this.orientationChangeService.changeEmit()
  }

  subscribeToOrientChange() {
    this.subOrientChange = this.orientationChangeService.action$.subscribe((data: { orient: Orientation, deviceType: 'Phone' | 'Tablet', width?: number }) => {
      this.orient = data.orient
      if (!this.isInitView)
        this.changeScrollHeight(data.orient)
      this.isInitView = false
      this._changeDetectionRef.detectChanges()
    })
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
