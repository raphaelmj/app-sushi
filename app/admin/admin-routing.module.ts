import { AuthFailRedirectGuard } from './../services/guard/auth-fail-redirect.guard';
import { ConfigResolveService } from './../services/config-resolve.service';
import { CartSetsResolveService } from './../services/cart-sets-resolve.service';
import { NgModule } from "@angular/core";
import { Routes } from "@angular/router";
import { NativeScriptRouterModule } from "@nativescript/angular";
import { AdminComponent } from "./admin.component";
import { AllOrdersResolveService } from "~/services/orders/all-orders-resolve.service";
import { ResolveUserService } from "~/services/resolve-user.service";
import { CartOrderComponent } from "./cart-order/cart-order.component";
import { OrderDetailsResolveService } from "~/services/orders/order-details-resolve.service";
import { ResolvePlusElementsService } from "~/services/resolve-plus-elements.service";
import { OptionsResolveService } from "~/services/options/options-resolve.service";
import { MenuCategoriesAllResolveService } from "~/services/menu/menu-categories-all-resolve.service";
import { CartCategoriesResolveService } from "~/services/menu/cart-categories-resolve.service";
import { ResolvePlusElementsGroupService } from '~/services/resolve-plus-elements-group.service';

const routes: Routes = [
  {
    path: "admin",
    component: AdminComponent,
    resolve: { user: ResolveUserService, ordersData: AllOrdersResolveService, config: ConfigResolveService },
  },
  {
    path: "order/:id",
    component: CartOrderComponent,
    resolve: {
      user: ResolveUserService,
      config: ConfigResolveService,
      orderData: OrderDetailsResolveService,
      plusCartCategories: ResolvePlusElementsGroupService,
      options: OptionsResolveService,
      menuElements: MenuCategoriesAllResolveService,
      cartCategories: CartCategoriesResolveService,
    },
    canActivate: [AuthFailRedirectGuard]
  },
];

@NgModule({
  imports: [NativeScriptRouterModule.forChild(routes)],
  exports: [NativeScriptRouterModule],
})
export class AdminRoutingModule { }
