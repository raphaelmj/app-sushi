import { PipesModule } from './../pipes/pipes.module';
import { ToolsModule } from '~/tools/tools.module';
import { NativeScriptUIGaugeModule } from 'nativescript-ui-gauge/angular';
import { NativeScriptUIAutoCompleteTextViewModule } from 'nativescript-ui-autocomplete/angular';
import { NativeScriptUIDataFormModule } from 'nativescript-ui-dataform/angular';
import { NativeScriptUIChartModule } from 'nativescript-ui-chart/angular';
import { NativeScriptUICalendarModule } from 'nativescript-ui-calendar/angular';
import { NativeScriptUIListViewModule } from 'nativescript-ui-listview/angular';
import { NativeScriptUISideDrawerModule } from 'nativescript-ui-sidedrawer/angular';
import { ServicesModule } from './../services/services.module';
import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';

import { ReservationsRoutingModule } from './reservations-routing.module';
import { NativeScriptCommonModule } from '@nativescript/angular';
import { ReservationsComponent } from './reservations.component';
import { ReservationRowComponent } from './reservation-row/reservation-row.component';


@NgModule({
  declarations: [ReservationsComponent, ReservationRowComponent],
  imports: [
    ReservationsRoutingModule,
    NativeScriptCommonModule,
    NativeScriptCommonModule,
    NativeScriptUISideDrawerModule,
    NativeScriptUIListViewModule,
    NativeScriptUICalendarModule,
    NativeScriptUIChartModule,
    NativeScriptUIDataFormModule,
    NativeScriptUIAutoCompleteTextViewModule,
    NativeScriptUIGaugeModule,
    NativeScriptCommonModule,
    ToolsModule,
    PipesModule,
    ServicesModule
  ],
  schemas: [NO_ERRORS_SCHEMA]
})
export class ReservationsModule { }
