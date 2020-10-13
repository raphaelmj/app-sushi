import { Orientation } from 'tns-core-modules/ui/layouts/stack-layout';
import { OrientationChangeService } from './../../services/orientation-change.service';
import { Subscription } from 'rxjs';
import { ReverseOptions } from '~/models/reverse-options';
import { DescOptions } from '~/models/desc-options';
import { MenuElement } from '~/models/menu-element';
import { PlusElementConfigComponent } from './../plus-element-config/plus-element-config.component';
import { ViewContainerRef, ComponentRef, Type, ComponentFactoryResolver, ChangeDetectorRef } from '@angular/core';
import { ViewChild } from '@angular/core';
import { SelectedIndexChangedEventData } from 'tns-core-modules/ui/tab-view';
import { CartCategory } from '~/models/cart-category';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ModalDialogParams } from '@nativescript/angular';
import { PlusElement } from '~/models/cart-element';
import { screen } from "tns-core-modules/platform";
import { on } from "tns-core-modules/application";

@Component({
  selector: 'app-plus-elements',
  templateUrl: './plus-elements.component.html',
  styleUrls: ['./plus-elements.component.scss']
})
export class PlusElementsComponent implements OnInit, OnDestroy {

  elementOptions: { desc: DescOptions[]; reverse: ReverseOptions[] }
  sub: Subscription
  plusCartCategories: CartCategory[]
  cartPlusCategoriesTabs: CartCategory[] = []
  plusElements: PlusElement[] = []
  selectedIndex: number = 0
  scrollHeight: number = Math.ceil(screen.mainScreen.heightDIPs) - 120;
  gridRows: string = 'auto,*,50'
  showAdded: boolean = true
  @ViewChild('temp', { read: ViewContainerRef, static: false }) temp: ViewContainerRef
  configPlusC: ComponentRef<PlusElementConfigComponent>

  subClose: Subscription
  subAdd: Subscription
  subOrientChange: Subscription
  isInitView: boolean = true
  orient: Orientation
  cartPlusDiv: number = 4

  constructor(
    private params: ModalDialogParams,
    private cf: ComponentFactoryResolver,
    private orientationChangeService: OrientationChangeService,
    private _changeDetectionRef: ChangeDetectorRef
  ) {
    this.plusCartCategories = params.context.plusCartCategories
    this.plusElements = params.context.basePlusElements
    this.elementOptions = params.context.elementOptions
  }

  ngOnInit(): void {
    this.subscribeToOrientChange()
    this.cartPlusCategoriesTabs = this.plusCartCategories.map((e, i) => {
      var { elements, ...rest } = e
      rest['elements'] = []
      return rest
    })
    this.cartPlusCategoriesTabs[this.selectedIndex].elements = this.plusCartCategories[this.selectedIndex].elements
  }

  subscribeToOrientChange() {
    this.subOrientChange = this.orientationChangeService.action$.subscribe((data: { orient: Orientation, deviceType: 'Phone' | 'Tablet', width?: number, height?:number }) => {
      this.orient = data.orient
      switch (data.orient) {
        case "horizontal":
          this.setDataFromHeight(data.height)
          break;
        case "vertical":
          this.setDataFromHeight(data.width)
          break;
      }
      if (!this.isInitView)
        this.scrollHeight = Math.ceil(screen.mainScreen.heightDIPs) - 120;
      this.isInitView = false
      this._changeDetectionRef.detectChanges()
    })
  }

  setDataFromHeight(h: number) {
    if (h > 1000) {
      this.cartPlusDiv = 4
    } else if (h <= 1000 && h > 600) {
      this.cartPlusDiv = 3
    } else {
      this.cartPlusDiv = 2
    }
  }

  onSelectedIndexchanged(event: SelectedIndexChangedEventData) {
    this.selectedIndex = event.newIndex
    this.cartPlusCategoriesTabs[this.selectedIndex].elements = this.plusCartCategories[this.selectedIndex].elements
  }

  plusElement(event: { element: MenuElement, index: number | null, priceNameIndex: number | null }) {
    this.gridRows = '*,0,0,0'
    this.temp.clear()
    let conf = this.cf.resolveComponentFactory(<Type<PlusElementConfigComponent>>PlusElementConfigComponent)
    this.configPlusC = this.temp.createComponent(conf)
    this.configPlusC.instance.element = event.element
    this.configPlusC.instance.index = event.index
    this.configPlusC.instance.priceNameIndex = event.priceNameIndex
    this.configPlusC.instance.elementOptions = this.elementOptions
    this.showAdded = false
    this.subClose = this.configPlusC.instance.emitClose.subscribe(r => {
      this.gridRows = 'auto,*,50'
      this.configPlusC.destroy()
      this.showAdded = true
    })
    this.subAdd = this.configPlusC.instance.emitAdd.subscribe((r: PlusElement) => {
      this.gridRows = 'auto,*,50'
      this.showAdded = true
      this.plusElements.push(r)
      this.configPlusC.destroy()
    })
  }



  removePlusElement(event: number) {
    this.plusElements.splice(event, 1)
  }

  close() {
    this.params.closeCallback(this.plusElements)
  }

  ngOnDestroy(): void {
    if (this.sub)
      this.sub.unsubscribe()
    if (this.subOrientChange)
      this.subOrientChange.unsubscribe()
    if (this.subClose)
      this.subClose.unsubscribe()
  }

}
