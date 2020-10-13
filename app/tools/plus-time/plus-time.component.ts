import { Component, OnInit } from '@angular/core';
import { ModalDialogParams } from '@nativescript/angular';

@Component({
  selector: 'app-plus-time',
  templateUrl: './plus-time.component.html',
  styleUrls: ['./plus-time.component.scss']
})
export class PlusTimeComponent implements OnInit {

  pluses: number[] = [
    10,
    20,
    30,
    45,
    60,
    90,
    120,
    180
  ]

  constructor(private params: ModalDialogParams) { }

  ngOnInit(): void {
  }

  addPlus(plus: number) {
    this.params.closeCallback(plus)
  }

}
