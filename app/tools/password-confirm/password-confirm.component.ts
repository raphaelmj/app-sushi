import { AuthService } from '~/services/auth.service';
import { ModalDialogParams } from '@nativescript/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';

export enum ConfirmPasswordType {
  backend = "backend",
  imageCode = "imageCode"
}

@Component({
  selector: 'app-password-confirm',
  templateUrl: './password-confirm.component.html',
  styleUrls: ['./password-confirm.component.scss']
})
export class PasswordConfirmComponent implements OnInit {

  formP: FormGroup
  type: ConfirmPasswordType
  confirmPasswordType = ConfirmPasswordType
  randomCode: string

  constructor(
    private fb: FormBuilder,
    private params: ModalDialogParams,
    private authService: AuthService
  ) {
    if (params.context.type) {
      this.type = params.context.type
    }
    this.randomCode = Math.random().toString(8).substring(2, 4) + Math.random().toString(8).substring(6, 8);
  }

  ngOnInit(): void {
    this.formP = this.fb.group({
      password: ['', Validators.required]
    })
  }


  confirmPassword() {
    this.formP.get('password').markAsTouched();
    if (this.formP.valid) {
      this.authService.checkPassword(this.formP.get('password').value).then(bool => {
        if (bool) {
          this.params.closeCallback(true)
        } else {
          this.formP.get('password').setErrors({ authfail: true })
        }
      })
    }
  }

  confirmImageCode() {
    if (this.formP.get('password').value == this.randomCode) {
      this.params.closeCallback(true)
    }
  }

  cancel() {
    this.params.closeCallback(false)
  }

}
