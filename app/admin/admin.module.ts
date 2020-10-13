import { SpecialElementComponent } from './../tools/special-element/special-element.component';
import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';

import { AdminRoutingModule } from './admin-routing.module';
import { NativeScriptCommonModule, NativeScriptFormsModule } from '@nativescript/angular';
import { AdminComponent } from './admin.component';
import { NativeScriptUISideDrawerModule } from 'nativescript-ui-sidedrawer/angular';
import { NativeScriptUIListViewModule } from 'nativescript-ui-listview/angular';
import { NativeScriptUICalendarModule } from 'nativescript-ui-calendar/angular';
import { NativeScriptUIChartModule } from 'nativescript-ui-chart/angular';
import { NativeScriptUIDataFormModule } from 'nativescript-ui-dataform/angular';
import { NativeScriptUIAutoCompleteTextViewModule } from 'nativescript-ui-autocomplete/angular';
import { NativeScriptUIGaugeModule } from 'nativescript-ui-gauge/angular';
import { ToolsModule } from '~/tools/tools.module';
import { CartOrderComponent } from './cart-order/cart-order.component';
import { ListOrderComponent } from './list-order/list-order.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ServicesModule } from '~/services/services.module';
import { SuggestDescComponent } from '~/tools/suggest-desc/suggest-desc.component';
import { PlusElementsComponent } from '~/tools/plus-elements/plus-elements.component';
import { ReverseDescComponent } from '~/tools/reverse-desc/reverse-desc.component';
import { PipesModule } from '~/pipes/pipes.module';
import { StringOptionsSelectComponent } from '~/tools/string-options-select/string-options-select.component';
import { QuantityModalComponent } from '~/tools/quantity-modal/quantity-modal.component';
import { QuickStatsComponent } from '~/tools/quick-stats/quick-stats.component';


@NgModule({
  declarations: [AdminComponent,
    CartOrderComponent,
    ListOrderComponent,
  ],
  imports: [
    AdminRoutingModule,
    NativeScriptUISideDrawerModule,
    NativeScriptUIListViewModule,
    NativeScriptUICalendarModule,
    NativeScriptUIChartModule,
    NativeScriptUIDataFormModule,
    NativeScriptUIAutoCompleteTextViewModule,
    NativeScriptUIGaugeModule,
    NativeScriptCommonModule,
    ToolsModule,
    NativeScriptFormsModule,
    ReactiveFormsModule,
    // TNSImageCacheItModule,
    ServicesModule,
    PipesModule
  ],
  schemas: [NO_ERRORS_SCHEMA],
  entryComponents: [
    SuggestDescComponent,
    PlusElementsComponent,
    ReverseDescComponent,
    StringOptionsSelectComponent,
    QuantityModalComponent,
    SpecialElementComponent,
    QuickStatsComponent,
  ]
})
export class AdminModule { }
