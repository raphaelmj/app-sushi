import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { ModalDialogParams } from '@nativescript/angular/directives/dialogs';;
import { DescOptions } from '~/models/desc-options';
import { screen } from "tns-core-modules/platform";
import { on } from "tns-core-modules/application";


@Component({
  selector: 'app-suggest-desc',
  templateUrl: './suggest-desc.component.html',
  styleUrls: ['./suggest-desc.component.scss']
})
export class SuggestDescComponent implements OnInit, OnDestroy {

  sub: Subscription
  descWordsGroups: DescOptions[]
  currentGroup: DescOptions
  wordsFiltered: Array<string> = []
  words: Array<string> = [];
  wordsOutput: Array<string> = []
  scrollHeight: number = Math.ceil(screen.mainScreen.heightDIPs) - 120;

  constructor(private params: ModalDialogParams) {
    this.wordsOutput = params.context.currentElements
    this.descWordsGroups = params.context.baseElementsGroups
    this.currentGroup = this.descWordsGroups[0]
    this.words = this.currentGroup.tags
  }

  ngOnInit(): void {
    this.wordsFiltered = this.words
    // this.filterIfExists()
    this.changeOrientationObserve()
  }

  changeOrientationObserve() {
    on("orientationChanged", (evt) => {
      this.scrollHeight = Math.ceil(screen.mainScreen.heightDIPs) - 120;
    });
  }

  changeCategory(item: DescOptions) {
    this.currentGroup = item
    this.words = this.currentGroup.tags
    this.wordsFiltered = this.words
    // this.filterIfExists()
  }

  addInfo(item: string) {
    this.wordsOutput.push(item)
    // this.wordsFiltered = this.words.filter(w => {
    //   var isIn: boolean = false
    //   this.wordsOutput.map(owr => {
    //     if (owr == w) {
    //       isIn = true
    //     }
    //   })
    //   return !isIn
    // })
  }

  removeInfo(i: number) {
    this.wordsOutput.splice(i, 1)
    // this.wordsFiltered = this.words.filter(w => {
    //   var isIn: boolean = false
    //   this.wordsOutput.map(owr => {
    //     if (owr == w) {
    //       isIn = true
    //     }
    //   })
    //   return !isIn
    // })
  }

  close() {
    this.params.closeCallback(this.wordsOutput)
  }

  // makeSuggest(change: string) {
  //   this.wordsFiltered = this.words.filter(w => {
  //     var wU = w.toLocaleUpperCase()
  //     var isIn: boolean = false
  //     this.wordsOutput.map(owr => {
  //       if (owr == w) {
  //         isIn = true
  //       }
  //     })
  //     var regex = '^' + change.toLocaleUpperCase() + '.*'
  //     return new RegExp(regex, 'g').test(wU) && !isIn
  //   })
  // }

  filterIfExists() {
    this.wordsFiltered = this.words.filter(w => {
      var isIn: boolean = false
      this.wordsOutput.map(owr => {
        if (owr == w) {
          isIn = true
        }
      })
      return !isIn
    })
  }

  ngOnDestroy(): void {
    if (this.sub)
      this.sub.unsubscribe()
  }


}
