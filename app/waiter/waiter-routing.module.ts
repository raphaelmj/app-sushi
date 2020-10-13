import { AuthFailRedirectGuard } from './../services/guard/auth-fail-redirect.guard';
import { ResolvePlusElementsGroupService } from './../services/resolve-plus-elements-group.service';
import { ConfigResolveService } from './../services/config-resolve.service';
import { CartSetsResolveService } from './../services/cart-sets-resolve.service';
import { NgModule } from "@angular/core";
import { Routes } from "@angular/router";
import { NativeScriptRouterModule } from "@nativescript/angular";
import { WaiterComponent } from "./waiter.component";
import { AnchorResolveService } from "~/services/anchors/anchor-resolve.service";
import { ResolveUserService } from "~/services/resolve-user.service";
import { AnchorAllResolveService } from "~/services/anchors/anchor-all-resolve.service";
import { ResolvePlusElementsService } from "~/services/resolve-plus-elements.service";
import { OptionsResolveService } from "~/services/options/options-resolve.service";
import { MenuCategoriesAllResolveService } from "~/services/menu/menu-categories-all-resolve.service";
import { CartCategoriesResolveService } from "~/services/menu/cart-categories-resolve.service";

const routes: Routes = [
  {
    path: "home",
    component: WaiterComponent,
    resolve: {
      config: ConfigResolveService,
      user: ResolveUserService,
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
export class WaiterRoutingModule { }
