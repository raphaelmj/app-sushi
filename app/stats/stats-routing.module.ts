import { DayElementTypesResolveService } from './../services/stats/day-element-types-resolve.service';
import { ResolveUserService } from '~/services/resolve-user.service';
import { IsSuperAdminGuard } from './../services/guard/is-super-admin.guard';
import { AuthFailRedirectGuard } from './../services/guard/auth-fail-redirect.guard';
import { StatsComponent } from './stats.component';
import { NgModule } from '@angular/core';
import { Routes } from '@angular/router';
import { NativeScriptRouterModule } from '@nativescript/angular';

const routes: Routes = [
  { path: 'stats', component: StatsComponent, resolve: { user: ResolveUserService, dayElements: DayElementTypesResolveService }, canActivate: [AuthFailRedirectGuard, IsSuperAdminGuard] }
];

@NgModule({
  imports: [NativeScriptRouterModule.forChild(routes)],
  exports: [NativeScriptRouterModule]
})
export class StatsRoutingModule { }
