import { ChangeDetectorRef } from '@angular/core';
import { PlusElement } from '~/models/cart-element';
import { MenuElement } from '~/models/menu-element';
import { CartCategory } from '~/models/cart-category';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { screen } from "tns-core-modules/platform";
import { on } from "tns-core-modules/application";

@Component({
  selector: 'app-options-plus-view',
  templateUrl: './options-plus-view.component.html',
  styleUrls: ['./options-plus-view.component.scss']
})
export class OptionsPlusViewComponent implements OnInit {

  @Input() elements: MenuElement[]
  @Input() initBool: boolean = false
  @Output() emitPlus: EventEmitter<{ element: MenuElement, index: number | null, priceNameIndex: number | null }> = new EventEmitter<{ element: MenuElement, index: number | null, priceNameIndex: number | null }>()
  scrollHeight: number = Math.ceil(screen.mainScreen.heightDIPs) - 160;
  width: string = '50%'


  constructor(private _changeDetectionRef: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.changeOrientationObserve()
  }

  changeOrientationObserve() {
    on("orientationChanged", (evt) => {
      this.scrollHeight = Math.ceil(screen.mainScreen.heightDIPs) - 160;
      this._changeDetectionRef.detectChanges()
    });
  }

  plusDescElement(event: { element: MenuElement, index: number | null, priceNameIndex: number | null }) {
    this.emitPlus.emit({ element: event.element, index: event.index, priceNameIndex: event.priceNameIndex })
  }

  addPlus(element: MenuElement, index: number | null, priceNameIndex: number | null) {
    this.emitPlus.emit({ element, index, priceNameIndex })
  }


}
