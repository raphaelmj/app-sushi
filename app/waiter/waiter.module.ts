import { ConfigStepOptionsManyComponent } from './../tools/config-step-options-many/config-step-options-many.component';
import { ReservationModalComponent } from './../tools/reservation-modal/reservation-modal.component';
import { StepOptionsComponent } from './../tools/step-options/step-options.component';
import { SpecialElementComponent } from './../tools/special-element/special-element.component';
import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";

import { WaiterRoutingModule } from "./waiter-routing.module";
import { NativeScriptCommonModule, NativeScriptFormsModule } from "@nativescript/angular";
import { WaiterComponent } from "./waiter.component";
import { NativeScriptUISideDrawerModule } from "nativescript-ui-sidedrawer/angular";
import { NativeScriptUIListViewModule } from "nativescript-ui-listview/angular";
import { NativeScriptUICalendarModule } from "nativescript-ui-calendar/angular";
import { NativeScriptUIChartModule } from "nativescript-ui-chart/angular";
import { NativeScriptUIDataFormModule } from "nativescript-ui-dataform/angular";
import { NativeScriptUIAutoCompleteTextViewModule } from "nativescript-ui-autocomplete/angular";
import { NativeScriptUIGaugeModule } from "nativescript-ui-gauge/angular";
import { ToolsModule } from "~/tools/tools.module";
import { ReactiveFormsModule } from "@angular/forms";
import { ServicesModule } from "~/services/services.module";
import { SuggestDescComponent } from "~/tools/suggest-desc/suggest-desc.component";
import { PlusElementsComponent } from "~/tools/plus-elements/plus-elements.component";
import { ModalDatetimepicker } from "nativescript-modal-datetimepicker";
import { PipesModule } from "~/pipes/pipes.module";
import { ReverseDescComponent } from "~/tools/reverse-desc/reverse-desc.component";
import { PlusTimeComponent } from "~/tools/plus-time/plus-time.component";
import { StringOptionsSelectComponent } from "~/tools/string-options-select/string-options-select.component";
import { QuantityModalComponent } from "~/tools/quantity-modal/quantity-modal.component";

@NgModule({
  declarations: [WaiterComponent],
  imports: [
    WaiterRoutingModule,
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
    ServicesModule,
    PipesModule,
  ],
  schemas: [NO_ERRORS_SCHEMA],
  entryComponents: [
    SuggestDescComponent,
    PlusElementsComponent,
    ReverseDescComponent,
    PlusTimeComponent,
    StringOptionsSelectComponent,
    QuantityModalComponent,
    SpecialElementComponent,
    StepOptionsComponent,
    ReservationModalComponent,
    ConfigStepOptionsManyComponent,
  ],
  providers: [ModalDatetimepicker],
})
export class WaiterModule { }
