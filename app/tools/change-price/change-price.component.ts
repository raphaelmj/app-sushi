import { CalculateService } from './../../services/calculate/calculate.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalDialogParams } from '@nativescript/angular';
import { CartElement } from '~/models/cart-element';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-change-price',
  templateUrl: './change-price.component.html',
  styleUrls: ['./change-price.component.scss']
})
export class ChangePriceComponent implements OnInit {

  cartEl: CartElement
  formData: FormGroup

  constructor(private params: ModalDialogParams, private fb: FormBuilder, private calculateService: CalculateService) {
    this.cartEl = params.context.cartEl
  }

  ngOnInit(): void {
    this.formData = this.fb.group({
      price: [this.calculateService.stringToNumber(this.cartEl.pricePerOne), [Validators.pattern('[0-9]+'), Validators.required]]
    })
  }


  close() {
    if (this.formData.valid) {
      let p: number = Number(this.formData.get('price').value)
      this.params.closeCallback(p)
    }
  }

  closeExit() {
    this.params.closeCallback(false)
  }

}
