import { PipesModule } from '~/pipes/pipes.module';
import { ServicesModule } from '~/services/services.module';
import { NativeScriptUIGaugeModule } from 'nativescript-ui-gauge/angular';
import { NativeScriptUIAutoCompleteTextViewModule } from 'nativescript-ui-autocomplete/angular';
import { NativeScriptUIChartModule } from 'nativescript-ui-chart/angular';
import { NativeScriptUIDataFormModule } from 'nativescript-ui-dataform/angular';
import { NativeScriptUICalendarModule } from 'nativescript-ui-calendar/angular';
import { NativeScriptUIListViewModule } from 'nativescript-ui-listview/angular';
import { NativeScriptUISideDrawerModule } from 'nativescript-ui-sidedrawer/angular';
import { ToolsModule } from '~/tools/tools.module';
import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';

import { StatsRoutingModule } from './stats-routing.module';
import { NativeScriptCommonModule } from '@nativescript/angular';
import { StatsComponent } from './stats.component';


@NgModule({
  declarations: [StatsComponent],
  imports: [
    StatsRoutingModule,
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
    ServicesModule
  ],
  schemas: [NO_ERRORS_SCHEMA]
})
export class StatsModule { }
