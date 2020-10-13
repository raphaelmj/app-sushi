import { AfterViewInit } from '@angular/core';
import { Orientation } from 'tns-core-modules/ui/layouts/stack-layout';
import { OrientationChangeService } from './../../services/orientation-change.service';
import { CalculateService } from './../../services/calculate/calculate.service';
import { EventEmitter, ChangeDetectorRef, AfterContentInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { OnDestroy, Output } from '@angular/core';
import { PlusElementConfigComponent } from './../plus-element-config/plus-element-config.component';
import { ViewContainerRef, ComponentRef, ComponentFactoryResolver, Type } from '@angular/core';
import { ViewChild } from '@angular/core';
import { MenuElement } from '~/models/menu-element';
import { CartService } from '~/services/cart.service';
import { ReverseElement, PlusElement } from '~/models/cart-element';
import { ReverseOptions } from '~/models/reverse-options';
import { DescOptions } from '~/models/desc-options';
import { SelectedIndexChangedEventData } from 'tns-core-modules/ui/tab-view';
import { CartCategory } from '~/models/cart-category';
import { Component, OnInit, Input } from '@angular/core';
import { screen } from "tns-core-modules/platform";
import { on } from "tns-core-modules/application";

@Component({
  selector: 'app-all-options-plus-view',
  templateUrl: './all-options-plus-view.component.html',
  styleUrls: ['./all-options-plus-view.component.scss']
})
export class AllOptionsPlusViewComponent implements OnInit, OnDestroy, AfterViewInit {

  @Output() emitChange: EventEmitter<{ plusElements: PlusElement[], reverseElements: ReverseElement[], descElements: string[] }> = new EventEmitter<{ plusElements: PlusElement[], reverseElements: ReverseElement[], descElements: string[] }>()
  @Input() cartPlusCategories: CartCategory[]
  @Input() cartPlusCategoriesTabs: CartCategory[] = []
  @Input() elementOptions: { desc: DescOptions[]; reverse: ReverseOptions[] }
  @Input() plusElements: PlusElement[] = []
  descElements: string[] = []
  reverseElements: ReverseElement[] = []
  current: number
  initOthers: boolean = false
  scrollHeight: number = Math.ceil(screen.mainScreen.heightDIPs) - 120;
  gridRows: string = 'auto,*'

  subClose: Subscription
  subAdd: Subscription
  showAdded: boolean = true
  subOrientChange: Subscription
  isInitView: boolean = true
  orient: Orientation
  cartPlusDiv: number = 4

  @ViewChild('temp', { read: ViewContainerRef, static: false }) temp: ViewContainerRef
  configPlusC: ComponentRef<PlusElementConfigComponent>

  constructor(
    private cartService: CartService,
    private cf: ComponentFactoryResolver,
    private orientationChangeService: OrientationChangeService,
    private calculateService: CalculateService,
    private _changeDetectionRef: ChangeDetectorRef
  ) { }

  ngAfterViewInit(): void {
    if (this.plusElements.length > 0) {
      this.gridRows = 'auto,*'
      this._changeDetectionRef.detectChanges()
    }
  }

  ngOnInit(): void {
    this.cartPlusCategoriesTabs = this.cartPlusCategories.map(e => {
      var { elements, ...rest } = e
      rest['elements'] = []
      return rest
    })
    this.initOthers = true
  }

  subscribeToOrientChange() {
    this.subOrientChange = this.orientationChangeService.action$.subscribe((data: { orient: Orientation, deviceType: 'Phone' | 'Tablet', width?: number, height?: number }) => {
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
    this.current = event.newIndex
    if ((this.cartPlusCategories.length - 1) >= this.current)
      this.cartPlusCategoriesTabs[this.current].elements = this.cartPlusCategories[this.current].elements
  }

  plusElement(event: { element: MenuElement, index: number | null, priceNameIndex: number | null }) {
    this.gridRows = '*,0,0'
    this.temp.clear()
    let conf = this.cf.resolveComponentFactory(<Type<PlusElementConfigComponent>>PlusElementConfigComponent)
    this.configPlusC = this.temp.createComponent(conf)
    this.configPlusC.instance.element = event.element
    this.configPlusC.instance.index = event.index
    this.configPlusC.instance.priceNameIndex = event.priceNameIndex
    this.configPlusC.instance.elementOptions = this.elementOptions
    this.showAdded = false
    this.subClose = this.configPlusC.instance.emitClose.subscribe(r => {
      this.gridRows = 'auto,*'
      this.configPlusC.destroy()
      this.showAdded = true
    })
    this.subAdd = this.configPlusC.instance.emitAdd.subscribe((r: PlusElement) => {
      this.gridRows = 'auto,*'
      this.showAdded = true
      this.plusElements.push(r)
      this.emitChange.emit({ plusElements: this.plusElements, reverseElements: this.reverseElements, descElements: this.descElements })
      this.configPlusC.destroy()
    })
  }

  changeReverse(event: ReverseElement[]) {
    this.reverseElements = event
    this.emitChange.emit({ plusElements: this.plusElements, reverseElements: this.reverseElements, descElements: this.descElements })
  }

  changeDesc(event: string[]) {
    this.descElements = event
    this.emitChange.emit({ plusElements: this.plusElements, reverseElements: this.reverseElements, descElements: this.descElements })
  }

  removePlusElement(event: number) {
    this.plusElements.splice(event, 1)
    this.emitChange.emit({ plusElements: this.plusElements, reverseElements: this.reverseElements, descElements: this.descElements })
  }


  removePlusElementStep(event: { index: number, indexStep: number }) {
    this.plusElements[event.index].stepOptionsList.splice(event.indexStep, 1)
    if (this.plusElements[event.index].stepOptionsList.length == 0) {
      this.plusElements.splice(event.indexStep, 1)
      this.emitChange.emit({ plusElements: this.plusElements, reverseElements: this.reverseElements, descElements: this.descElements })
      return
    }
    var ps: Array<string | number> = []
    this.plusElements[event.index].stepOptionsList.map(p => {
      ps.push(p.pricePerOne)
    })
    let price = this.calculateService.pricePlusMapElements(0, ps)
    this.plusElements[event.index].price = price
    this.plusElements[event.index].pricePerOne = price
    this.emitChange.emit({ plusElements: this.plusElements, reverseElements: this.reverseElements, descElements: this.descElements })
  }


  removeElementOption(event: { index: number, indexOption: number }) {
    if (this.plusElements[event.index].qunatity == 1) {
      this.plusElements.splice(event.index, 1)
      this.emitChange.emit({ plusElements: this.plusElements, reverseElements: this.reverseElements, descElements: this.descElements })
      return;
    }
    this.plusElements[event.index].qunatity--
    this.plusElements[event.index].price = this.calculateService.multipleQuantity(this.plusElements[event.index].qunatity, this.plusElements[event.index].pricePerOne);
    this.plusElements[event.index].optionsElements.splice(event.indexOption, 1)
    this.emitChange.emit({ plusElements: this.plusElements, reverseElements: this.reverseElements, descElements: this.descElements })
  }


  ngOnDestroy(): void {
    if (this.subClose)
      this.subClose.unsubscribe()
    if (this.subAdd)
      this.subAdd.unsubscribe()
  }


}
