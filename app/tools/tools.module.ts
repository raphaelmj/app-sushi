import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import {
  NativeScriptCommonModule,
  NativeScriptFormsModule,
  NativeScriptRouterModule,
} from "@nativescript/angular";
import { PaginationComponent } from "./pagination/pagination.component";
import { SuggestDescComponent } from "./suggest-desc/suggest-desc.component";
import { NativeScriptUISideDrawerModule } from "nativescript-ui-sidedrawer/angular";
import { NativeScriptUIListViewModule } from "nativescript-ui-listview/angular";
import { NativeScriptUIDataFormModule } from "nativescript-ui-dataform/angular";
import { ReactiveFormsModule } from "@angular/forms";
import { PlusElementsComponent } from "./plus-elements/plus-elements.component";
import { ServicesModule } from "~/services/services.module";
import { AdminElementConfigPriceComponent } from "./admin-element-config-price/admin-element-config-price.component";
import { AdminElementDescElementComponent } from "./admin-element-desc-element/admin-element-desc-element.component";
import { AdminElementManyNamesComponent } from "./admin-element-many-names/admin-element-many-names.component";
import { AdminElementOneNameComponent } from "./admin-element-one-name/admin-element-one-name.component";
import { CartRowAdminComponent } from "./cart-row-admin/cart-row-admin.component";
import { PipesModule } from "~/pipes/pipes.module";
import { ReverseDescComponent } from "./reverse-desc/reverse-desc.component";
import { OrderSquareComponent } from "./order-square/order-square.component";
import { OrderElementViewComponent } from "./order-square/order-element-view/order-element-view.component";
import { RouteLoadingComponent } from "./route-loading/route-loading.component";
import { SelectElementsInlineComponent } from "./select-elements-inline/select-elements-inline.component";
import { PlusTimeComponent } from "./plus-time/plus-time.component";
import { StringOptionsSelectComponent } from "./string-options-select/string-options-select.component";
import { DescViewComponent } from "./all-options-plus-view/desc-view/desc-view.component";
import { ReverseViewComponent } from './all-options-plus-view/reverse-view/reverse-view.component';
import { LoadingAbsoluteComponent } from "./loading-absolute/loading-absolute.component";
import { QuantityModalComponent } from "./quantity-modal/quantity-modal.component";
import { OptionsElementChangeComponent } from "./options-element-change/options-element-change.component";
import { MenuViewComponent } from "./menu-view/menu-view.component";
import { SpecialElementComponent } from './special-element/special-element.component';
import { StepOptionsComponent } from './step-options/step-options.component';
import { ConfigPriceSelectComponent } from './step-options/config-price-select/config-price-select.component';
import { CustomOptionsViewComponent } from './custom-options-view/custom-options-view.component';
import { ChangePriceComponent } from './change-price/change-price.component';
import { PlusElementConfigComponent } from './plus-element-config/plus-element-config.component';
import { AllOptionsPlusViewComponent } from './all-options-plus-view/all-options-plus-view.component';
import { OptionsPlusViewComponent } from './all-options-plus-view/options-plus-view/options-plus-view.component';
import { DescElementsPlusComponent } from './all-options-plus-view/options-plus-view/desc-elements-plus/desc-elements-plus.component';
import { PlusElementRowComponent } from './plus-element-row/plus-element-row.component';
import { AdminElementConfigStepsPriceComponent } from './admin-element-config-steps-price/admin-element-config-steps-price.component';
import { ConfigStepOptionsComponent } from './config-step-options/config-step-options.component';
import { ReservationModalComponent } from './reservation-modal/reservation-modal.component';
import { ReservationSizeComponent } from './reservation-size/reservation-size.component';
import { PaidStatusComponent } from "./select-elements-inline/paid-status/paid-status.component";
import { QuickStatsComponent } from './quick-stats/quick-stats.component';
import { AdminElementConfigStepsPriceManyComponent } from './admin-element-config-steps-price-many/admin-element-config-steps-price-many.component';
import { ConfigStepOptionsManyComponent } from './config-step-options-many/config-step-options-many.component';
import { EditManyStepOptionsComponent } from './edit-many-step-options/edit-many-step-options.component';
import { ThreeStepsViewComponent } from './three-steps-view/three-steps-view.component';
import { ReservationDataComponent } from './reservation-data/reservation-data.component';
import { PasswordConfirmComponent } from './password-confirm/password-confirm.component';
import { AccElementsConfigComponent } from './acc-elements-config/acc-elements-config.component';
import { AccQuantityElementComponent } from './acc-elements-config/acc-quantity-element/acc-quantity-element.component';
import { NgPipesModule } from 'ngx-pipes';
import { PlusElementsCartViewComponent } from './cart-row-admin/plus-elements-cart-view/plus-elements-cart-view.component';
import { BonusSetConfigComponent } from './bonus-set-config/bonus-set-config.component';

@NgModule({
  declarations: [
    PaginationComponent,
    SuggestDescComponent,
    PlusElementsComponent,
    AdminElementConfigPriceComponent,
    AdminElementDescElementComponent,
    AdminElementManyNamesComponent,
    AdminElementOneNameComponent,
    AdminElementConfigStepsPriceComponent,
    CartRowAdminComponent,
    ReverseDescComponent,
    OrderSquareComponent,
    OrderElementViewComponent,
    RouteLoadingComponent,
    SelectElementsInlineComponent,
    PlusTimeComponent,
    StringOptionsSelectComponent,
    ReverseViewComponent,
    DescViewComponent,
    LoadingAbsoluteComponent,
    QuantityModalComponent,
    OptionsElementChangeComponent,
    MenuViewComponent,
    SpecialElementComponent,
    StepOptionsComponent,
    ConfigPriceSelectComponent,
    CustomOptionsViewComponent,
    ChangePriceComponent,
    PlusElementConfigComponent,
    AllOptionsPlusViewComponent,
    OptionsPlusViewComponent,
    DescElementsPlusComponent,
    PlusElementRowComponent,
    ConfigStepOptionsComponent,
    ReservationModalComponent,
    PaidStatusComponent,
    ReservationSizeComponent,
    QuickStatsComponent,
    AdminElementConfigStepsPriceManyComponent,
    ConfigStepOptionsManyComponent,
    EditManyStepOptionsComponent,
    ThreeStepsViewComponent,
    ReservationDataComponent,
    PasswordConfirmComponent,
    AccElementsConfigComponent,
    AccQuantityElementComponent,
    PlusElementsCartViewComponent,
    BonusSetConfigComponent,
  ],
  imports: [
    NativeScriptCommonModule,
    NativeScriptUIListViewModule,
    NativeScriptUIDataFormModule,
    NativeScriptFormsModule,
    NativeScriptRouterModule,
    ReactiveFormsModule,
    ServicesModule,
    PipesModule,
    NgPipesModule
  ],
  exports: [
    PaginationComponent,
    SuggestDescComponent,
    PlusElementsComponent,
    AdminElementConfigPriceComponent,
    AdminElementDescElementComponent,
    AdminElementManyNamesComponent,
    AdminElementOneNameComponent,
    AdminElementConfigStepsPriceComponent,
    CartRowAdminComponent,
    ReverseDescComponent,
    OrderSquareComponent,
    RouteLoadingComponent,
    SelectElementsInlineComponent,
    PlusElementsComponent,
    StringOptionsSelectComponent,
    LoadingAbsoluteComponent,
    QuantityModalComponent,
    OptionsElementChangeComponent,
    MenuViewComponent,
    SpecialElementComponent,
    StepOptionsComponent,
    ChangePriceComponent,
    PlusElementConfigComponent,
    AllOptionsPlusViewComponent,
    ConfigStepOptionsComponent,
    ReservationModalComponent,
    PaidStatusComponent,
    ReservationSizeComponent,
    QuickStatsComponent,
    AdminElementConfigStepsPriceManyComponent,
    ConfigStepOptionsManyComponent,
    EditManyStepOptionsComponent,
    ThreeStepsViewComponent,
    ReservationDataComponent,
    PasswordConfirmComponent,
    AccElementsConfigComponent,
    PlusElementsCartViewComponent,
    BonusSetConfigComponent,
  ],
  schemas: [NO_ERRORS_SCHEMA],
  entryComponents: [
    PlusTimeComponent,
    OptionsElementChangeComponent,
    CustomOptionsViewComponent,
    ChangePriceComponent,
    PlusElementConfigComponent,
    AllOptionsPlusViewComponent,
    ConfigStepOptionsComponent,
    ReservationModalComponent,
    ReservationSizeComponent,
    ConfigStepOptionsManyComponent,
    EditManyStepOptionsComponent,
    ReservationDataComponent,
    PasswordConfirmComponent,
    AccElementsConfigComponent,
    PlusElementsCartViewComponent,
    BonusSetConfigComponent,
  ],
})
export class ToolsModule { }
