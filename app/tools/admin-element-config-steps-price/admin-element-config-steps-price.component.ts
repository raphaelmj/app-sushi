import { EventEmitter } from '@angular/core';
import { MenuElement } from './../../models/menu-element';
import { Component, OnInit, Input, Output } from '@angular/core';
import { SITE_URL } from '~/config';

@Component({
  selector: 'app-admin-element-config-steps-price',
  templateUrl: './admin-element-config-steps-price.component.html',
  styleUrls: ['./admin-element-config-steps-price.component.scss']
})
export class AdminElementConfigStepsPriceComponent implements OnInit {
  @Output() emitAdd: EventEmitter<{
    element: MenuElement;
    index: number;
    priceNameIndex: number | null;
    asSimple?: boolean;
  }> = new EventEmitter<{
    element: MenuElement;
    index: number;
    priceNameIndex: number | null;
    asSimple?: boolean;
  }>();
  @Input() element: MenuElement;
  siteUrl: string = SITE_URL;

  constructor() { }

  ngOnInit(): void {
    // console.log(this.element.configStepsPrice)
  }

  addToCart() {
    this.emitAdd.emit({ element: this.element, index: null, priceNameIndex: null, asSimple: false });
  }

}
