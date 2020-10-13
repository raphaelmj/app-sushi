import { ModalDialogParams } from '@nativescript/angular';
import { FormGroup } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-reservation-size',
  templateUrl: './reservation-size.component.html',
  styleUrls: ['./reservation-size.component.scss']
})
export class ReservationSizeComponent implements OnInit {

  formData: FormGroup
  reservationSize: number

  constructor(private params: ModalDialogParams, private fb: FormBuilder) {
    this.reservationSize = params.context.reservationSize
  }

  ngOnInit(): void {
    this.formData = this.fb.group({ reservationSize: [this.reservationSize] })
  }

  qSize(action: 'plus' | 'minus') {
    var currentValue: number = parseInt(this.formData.get('reservationSize').value)
    // console.log(currentValue)
    switch (action) {
      case "minus":

        if (currentValue > 1) {
          currentValue--
          // console.log('minus', currentValue)
          this.formData.get('reservationSize').setValue(currentValue)
          this.reservationSize = Number(currentValue)
        }

        break
      case "plus":
        currentValue++
        // console.log('plus', currentValue)
        this.formData.get('reservationSize').setValue(currentValue)
        this.reservationSize = Number(currentValue)
        break
    }
  }

  setSize() {
    this.params.closeCallback(this.reservationSize)
  }

  unsetSize() {
    this.params.closeCallback(false)
  }

}
