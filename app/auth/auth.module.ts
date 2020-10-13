import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';

import { AuthRoutingModule } from './auth-routing.module';
import { NativeScriptFormsModule, NativeScriptCommonModule } from '@nativescript/angular';
import { LoginComponent } from './login/login.component';
import { ServicesModule } from '~/services/services.module';
import { NativeScriptUISideDrawerModule } from 'nativescript-ui-sidedrawer/angular';
import { NativeScriptUIListViewModule } from 'nativescript-ui-listview/angular';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    LoginComponent
  ],
  imports: [
    AuthRoutingModule,
    NativeScriptUISideDrawerModule,
    NativeScriptUIListViewModule,
    NativeScriptFormsModule,
    NativeScriptCommonModule,
    ReactiveFormsModule,
    // TNSImageCacheItModule,
    ServicesModule
  ],
  schemas: [NO_ERRORS_SCHEMA]
})
export class AuthModule { }
