import { ElementDesc } from '~/models/site';
import { MenuElement } from '~/models/menu-element';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-desc-elements-plus',
  templateUrl: './desc-elements-plus.component.html',
  styleUrls: ['./desc-elements-plus.component.scss']
})
export class DescElementsPlusComponent implements OnInit {

  @Input() element: MenuElement
  @Output() emitPlus: EventEmitter<{ element: MenuElement, index: number | null, priceNameIndex: number | null }> = new EventEmitter<{ element: MenuElement, index: number | null, priceNameIndex: number | null }>()
  descElements: ElementDesc[] = []
  open: boolean = false

  constructor() { }

  ngOnInit(): void {
  }

  openDescElements() {
    if (!this.open) {
      this.descElements = this.element.descElements
      this.open = true
    } else {
      this.descElements = []
      this.open = false
    }

  }

  add(element: MenuElement, index: number) {
    this.emitPlus.emit({ element, index, priceNameIndex: null })
  }

}
