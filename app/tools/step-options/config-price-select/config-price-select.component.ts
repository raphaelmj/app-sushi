import { EventEmitter } from '@angular/core';
import { PriceConfigSort } from './../../../models/price-config-sort';
import { Component, OnInit, Input, Output } from '@angular/core';

@Component({
  selector: 'app-config-price-select',
  templateUrl: './config-price-select.component.html',
  styleUrls: ['./config-price-select.component.scss']
})
export class ConfigPriceSelectComponent implements OnInit {

  @Input() priceConfigSort: PriceConfigSort[]
  @Input() index: number
  @Input() scrollHeight: number
  @Output() emitChange: EventEmitter<{ index: number, isSea: boolean }> = new EventEmitter<{ index: number, isSea: boolean }>()

  constructor() { }

  ngOnInit(): void {

  }

  selectOption(index: number, isSea: boolean) {
    this.index = index
    this.emitChange.emit({ index, isSea })
  }


}