import { AccElement, AccType } from './../../models/cart-element';
import { ACElementConfig } from './../../models/app-config';
import { Component, OnInit, Input, OnChanges, SimpleChanges, AfterContentInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-acc-elements-config',
  templateUrl: './acc-elements-config.component.html',
  styleUrls: ['./acc-elements-config.component.scss']
})
export class AccElementsConfigComponent implements OnInit, OnChanges, AfterContentInit {

  @Output() emitAccData: EventEmitter<AccElement[]> = new EventEmitter<AccElement[]>()
  @Input() acc: ACElementConfig[] | AccType[]
  @Input() dataAcc: AccElement[] = []

  constructor() {
  }

  ngOnInit(): void {

  }

  ngOnChanges(changes: SimpleChanges): void {

  }

  ngAfterContentInit(): void {
    if (this.dataAcc.length == 0)
      this.dataAcc = this.createZeroAcc(this.acc)
    else
      this.dataAcc = this.createAccFromData(this.acc, this.dataAcc)

    // this.emitAccData.emit(this.dataAcc)
  }

  changeValue(event: { howMany: number, index: number, acc: AccType }) {
    if (this.dataAcc[event.index].acc.name == event.acc.name) {
      this.dataAcc[event.index].howMany = event.howMany
      this.emitAccData.emit(this.dataAcc)
    }
  }

  createZeroAcc(acc: ACElementConfig[] | AccType[]): AccElement[] {
    var dataAcc: AccElement[] = []
    acc.map(a => {
      dataAcc.push({
        acc: a,
        howMany: 0
      })
    })
    return dataAcc
  }

  createAccFromData(acc: ACElementConfig[] | AccType[], data: AccElement[]): AccElement[] {
    var d = Object.assign([], data);
    var accData: AccElement[] = []
    acc.map((a: ACElementConfig | AccType, i: number) => {
      let isIn: boolean = false
      let existsIndex: number
      d.map((b: AccElement, j: number) => {
        if (a.name == b.acc.name) {
          isIn = true
          existsIndex = j
        }
      })
      if (isIn) {
        accData.push({
          acc: a,
          howMany: d[existsIndex].howMany
        })
        d.splice(existsIndex, 1)
      } else {
        accData.push({
          acc: a,
          howMany: 0
        })
      }
    })
    accData = accData.concat(d)
    return accData
  }

}
