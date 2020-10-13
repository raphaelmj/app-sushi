import { ReverseElement } from '~/models/cart-element';
import { SelectedIndexChangedEventData } from 'tns-core-modules/ui/tab-view';
import { ReverseOptions } from './../../models/reverse-options';
import { DescOptions } from './../../models/desc-options';
import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-custom-options-view',
  templateUrl: './custom-options-view.component.html',
  styleUrls: ['./custom-options-view.component.scss']
})
export class CustomOptionsViewComponent implements OnInit {

  @Output() optionChanged: EventEmitter<{ reverseElements: ReverseElement[], wordsOutput: Array<string> }> = new EventEmitter<{ reverseElements: ReverseElement[], wordsOutput: Array<string> }>()
  @Input() elementOptions: { desc: DescOptions[], reverse: ReverseOptions[] }
  @Input() reverseElements: ReverseElement[] = []
  @Input() wordsOutput: Array<string> = []

  constructor() { }

  onSelectedIndexchanged(event: SelectedIndexChangedEventData) {

  }

  ngOnInit(): void {
  }

  changeReverse(event: ReverseElement[]) {
    this.reverseElements = event
    this.changeData()
  }

  changeDesc(event: Array<string>) {
    this.wordsOutput = event
    this.changeData()
  }

  changeData() {
    this.optionChanged.emit({ reverseElements: this.reverseElements, wordsOutput: this.wordsOutput })
  }

}
