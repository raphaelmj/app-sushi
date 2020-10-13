import { OrderStatus, OrderStatusName } from '~/models/cart-order';
import { MessageService } from './../../services/message.service';
import { FormBuilder } from '@angular/forms';
import { ModalDialogParams } from '@nativescript/angular';
import { FormGroup } from '@angular/forms';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-reservation-data',
  templateUrl: './reservation-data.component.html',
  styleUrls: ['./reservation-data.component.scss']
})
export class ReservationDataComponent implements OnInit {

  formData: FormGroup
  description: string
  forWho: string
  phone: string
  reservationSize: number
  noSize: boolean = false


  constructor(private params: ModalDialogParams, private fb: FormBuilder, private messageService: MessageService) {
    this.noSize = params.context.noSize
    this.description = params.context.data.description
    this.forWho = params.context.data.forWho
    this.phone = params.context.data.phone
    if (!this.noSize)
      this.reservationSize = (params.context.data.reservationSize == 0) ? 1 : params.context.data.reservationSize
    else
      this.reservationSize = (params.context.data.reservationSize == 0) ? 0 : params.context.data.reservationSize
  }

  ngOnInit(): void {
    this.formData = this.fb.group({
      reservationSize: [this.reservationSize],
      description: [this.description],
      forWho: [this.forWho],
      phone: [this.phone]
    })
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
        }

        break
      case "plus":
        currentValue++
        // console.log('plus', currentValue)
        this.formData.get('reservationSize').setValue(currentValue)
        break
    }
  }


  setReservation() {
    this.params.closeCallback({ reservationSize: this.formData.get('reservationSize').value, description: this.formData.get('description').value, forWho: this.formData.get('forWho').value, phone: this.formData.get('phone').value })
  }

  unsetReservation() {
    this.params.closeCallback(false)
  }

}
