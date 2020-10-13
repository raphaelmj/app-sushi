import { EventEmitter } from '@angular/core';
import { Component, OnInit, Input, AfterContentInit, Output } from '@angular/core';
import { DescOptions } from '~/models/desc-options';
import { screen } from "tns-core-modules/platform";

@Component({
  selector: 'app-desc-view',
  templateUrl: './desc-view.component.html',
  styleUrls: ['./desc-view.component.scss']
})
export class DescViewComponent implements OnInit, AfterContentInit {

  @Output() emitChange: EventEmitter<Array<string>> = new EventEmitter<Array<string>>()
  @Input() descWordsGroups: DescOptions[]
  @Input() wordsOutput: Array<string> = []
  @Input() scrollHeight: number = Math.ceil(screen.mainScreen.heightDIPs) - 180;
  currentGroup: DescOptions
  words: Array<string> = [];
  wordsFiltered: Array<string> = [];



  constructor() { }


  ngOnInit(): void {

  }


  ngAfterContentInit(): void {
    this.currentGroup = this.descWordsGroups[0]
    this.words = this.currentGroup.tags
    this.wordsFiltered = this.words
  }

  changeCategory(item: DescOptions) {
    this.currentGroup = item
    this.words = this.currentGroup.tags
    this.wordsFiltered = this.words
  }

  addInfo(item: string) {
    this.wordsOutput.push(item)
    this.emitChange.emit(this.wordsOutput)
  }

  removeInfo(i: number) {
    this.wordsOutput.splice(i, 1)
    this.emitChange.emit(this.wordsOutput)
  }

}
