import { NgModule } from '@angular/core';
import { Routes } from '@angular/router';
import { NativeScriptRouterModule } from '@nativescript/angular';
import { AuthSuccessRedirect } from '~/services/guard/auth-success-redirect';
import { LoginComponent } from './login/login.component';

const routes: Routes = [{ path: "", component: LoginComponent }];

@NgModule({
  imports: [NativeScriptRouterModule.forChild(routes)],
  exports: [NativeScriptRouterModule]
})
export class AuthRoutingModule { }
