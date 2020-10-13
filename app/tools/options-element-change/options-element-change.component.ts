import { CartService } from '~/services/cart.service';
import { MenuElement } from '~/models/menu-element';
import { ElementMenuType } from './../../models/site';
import { Component, OnInit } from '@angular/core';
import { ModalDialogParams } from '@nativescript/angular';

@Component({
  selector: 'app-options-element-change',
  templateUrl: './options-element-change.component.html',
  styleUrls: ['./options-element-change.component.scss']
})
export class OptionsElementChangeComponent implements OnInit {

  element: MenuElement
  index: number
  quantity: number
  options: string[] = []
  optionsElements: string[] = []

  constructor(private params: ModalDialogParams, private cartService: CartService) {
    this.element = params.context.element
    this.index = params.context.index
    this.quantity = params.context.quantity
    this.options = this.cartService.findOptionsByType(this.element, this.index)
    this.optionsElements = params.context.optionsElements
  }

  ngOnInit(): void {
  }


  pushType(p: string) {
    if (this.optionsElements.length < this.quantity) {
      this.optionsElements.push(p)
    }
  }

  clearTag(index: number) {
    this.optionsElements.splice(index, 1)
  }


  close() {
    this.params.closeCallback(this.optionsElements)
  }


}
