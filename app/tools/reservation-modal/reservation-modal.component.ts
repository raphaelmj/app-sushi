import { MessageService } from './../../services/message.service';
import { FormGroup } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { ModalDialogParams } from '@nativescript/angular';
import { Component, OnInit } from '@angular/core';
import * as ModalPicker from "nativescript-modal-datetimepicker";
import * as moment from "moment";
import { PLUS_MINUTES } from '~/config';

@Component({
  selector: 'app-reservation-modal',
  templateUrl: './reservation-modal.component.html',
  styleUrls: ['./reservation-modal.component.scss']
})
export class ReservationModalComponent implements OnInit {

  formData: FormGroup
  readyDate: Date
  description: string
  forWho: string
  phone: string
  reservationSize: number
  isOnCart: boolean
  isCreate: boolean

  constructor(private params: ModalDialogParams, private fb: FormBuilder, private messageService: MessageService) {
    this.readyDate = params.context.readyDate
    this.description = params.context.data.description
    this.forWho = params.context.data.forWho
    this.phone = params.context.data.phone
    this.reservationSize = (params.context.data.reservationSize == 0) ? 1 : params.context.data.reservationSize
    this.isOnCart = params.context.isOnCart
    this.isCreate = params.context.isCreate
  }

  ngOnInit(): void {
    this.formData = this.fb.group({
      reservationSize: [this.reservationSize],
      description: [this.description],
      forWho: [this.forWho],
      phone: [this.phone],
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

  chooseDateTime() {
    var modal = new ModalPicker.ModalDatetimepicker();
    var d: Date = new Date()
    if (this.readyDate) {
      d = this.readyDate
    }
    var m = moment(d)
    modal.pickDate({ startingDate: m.toDate() }).then((day: ModalPicker.DateResponse) => {
      if (day) {
        m.date(day.day)
        m.month(day.month - 1)
        m.year(day.year)
        modal.pickTime({ startingHour: (new Date()).getHours(), startingMinute: (new Date()).getMinutes(), is24HourView: true }).then((time: ModalPicker.TimeResponse) => {

          if (this.isOnCart) {
            var plusMinutes = moment().add(moment.duration(PLUS_MINUTES, "minutes"));
          } else {
            var plusMinutes = moment(this.readyDate).add(moment.duration(PLUS_MINUTES, "minutes"));
          }
          // console.log(moment(d).format('YYYY-MM-DD HH:mm:ss'), plusMinutes.format('YYYY-MM-DD HH:mm:ss'))
          if (time) {
            m.hours(time.hour).minute(time.minute)

            if (m.isBefore(plusMinutes)) {
              this.messageService.showAlert('Czas nie przekracza 5 min.')
            } else {
              this.readyDate = m.toDate()
            }

          }
        })
      }
    })
  }

  setReservation() {
    if (this.readyDate) {
      this.params.closeCallback({ readyDate: this.readyDate, size: this.formData.get('reservationSize').value, description: this.formData.get('description').value, forWho: this.formData.get('forWho').value, phone: this.formData.get('phone').value })
    } else {
      this.messageService.showAlert('Ustaw datę i godzinę rezerwacji.')
      // this.params.closeCallback(false)
    }

  }

  unsetReservation() {
    this.params.closeCallback(false)
  }

}
