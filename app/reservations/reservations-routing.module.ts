import { DayReservationsResolveService } from './../services/orders/day-reservations-resolve.service';
import { AuthFailRedirectGuard } from './../services/guard/auth-fail-redirect.guard';
import { ResolveUserService } from './../services/resolve-user.service';
import { ReservationsComponent } from './reservations.component';
import { NgModule } from '@angular/core';
import { Routes } from '@angular/router';
import { NativeScriptRouterModule } from '@nativescript/angular';

const routes: Routes = [
  { path: 'reservations', component: ReservationsComponent, resolve: { user: ResolveUserService, dataR: DayReservationsResolveService }, canActivate: [AuthFailRedirectGuard] }
];

@NgModule({
  imports: [NativeScriptRouterModule.forChild(routes)],
  exports: [NativeScriptRouterModule]
})
export class ReservationsRoutingModule { }
