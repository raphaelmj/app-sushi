import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptCommonModule } from "@nativescript/angular";
import { ActionNamePipe } from "./action-name.pipe";
import { ActionShortNamePipe } from "./action-short-name.pipe";
import { PlusPriceDetailsPipe } from "./plus-price-details.pipe";
import { OrderStatusPipe } from "./order-status.pipe";
import { OrderLimitTimePipe } from "./order-limit-time.pipe";
import { DescListGroupPipe } from "./desc-list-group.pipe";
import { StripTagsPipe } from "./strip-tags.pipe";
import { RoleNamePipe } from "./role-name.pipe";
import { ExtraPriceInfoPipe } from './extra-price-info.pipe';
import { PricePerQuantityPipe } from './price-per-quantity.pipe';
import { DaySuffixPipe } from './day-suffix.pipe';
import { ConfigStepNamePipe } from './config-step-name.pipe';
import { ConfigStepPricePipe } from './config-step-price.pipe';
import { MergeNamesArrayPipe } from './merge-names-array.pipe';
import { ConfigStepElementNamePipe } from './config-step-element-name.pipe';
import { ConfigStepsViewGroupPipe } from './config-steps-view-group.pipe';
import { GroupOptionsTypesQuantityPipe } from './group-options-types-quantity.pipe';
import { ExtraPriceSimplePipe } from './extra-price-simple.pipe';
import { ConfigStepByElementViewGroupPipe } from './config-step-by-element-view-group.pipe';

@NgModule({
  declarations: [ActionNamePipe, ActionShortNamePipe, PlusPriceDetailsPipe, OrderStatusPipe, OrderLimitTimePipe, DescListGroupPipe, StripTagsPipe, RoleNamePipe, ExtraPriceInfoPipe, PricePerQuantityPipe, DaySuffixPipe, ConfigStepNamePipe, ConfigStepPricePipe, MergeNamesArrayPipe, ConfigStepElementNamePipe, ConfigStepsViewGroupPipe, GroupOptionsTypesQuantityPipe, ExtraPriceSimplePipe, ConfigStepByElementViewGroupPipe],
  imports: [NativeScriptCommonModule],
  schemas: [NO_ERRORS_SCHEMA],
  exports: [ActionNamePipe, ActionShortNamePipe, PlusPriceDetailsPipe, OrderStatusPipe, OrderLimitTimePipe, DescListGroupPipe, StripTagsPipe, RoleNamePipe, ExtraPriceInfoPipe, PricePerQuantityPipe, DaySuffixPipe, ConfigStepNamePipe, ConfigStepPricePipe, MergeNamesArrayPipe, ConfigStepElementNamePipe, ConfigStepsViewGroupPipe, GroupOptionsTypesQuantityPipe, ExtraPriceSimplePipe, ConfigStepByElementViewGroupPipe],
})
export class PipesModule { }
