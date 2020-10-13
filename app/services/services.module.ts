import { RefreshAfterDeleteOrderService } from './refresh-after-delete-order.service';
import { MenuCategoryService } from "./menu/menu-category.service";
import { CartCategoryService } from "./menu/cart-category.service";
import { TokenSqlService } from "./token-sql.service";
import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { AuthService } from "./auth.service";
import { HttpClientModule } from "@angular/common/http";
import { AuthSuccessRedirect } from "./guard/auth-success-redirect";
import { AnchorService } from "./anchors/anchor.service";
import { SiteService } from "./sites/site.service";
import { AddToCartService } from "./add-to-cart.service";
import { CartSummaryUpdateService } from "./cart-summary-update.service";
import { OrderService } from "./orders/order.service";
import { SoundService } from "./sound.service";
import { CartService } from "./cart.service";
import { AuthFailRedirectGuard } from "./guard/auth-fail-redirect.guard";
import { OptionService } from "./options/option.service";
import { RefreshOrdersService } from "./refresh-orders.service";
import { MessageService } from "./message.service";
import { Socket } from "dgram";
import { SocketListenService } from "./socket-listen.service";
import { GetDataOrdersRefreshService } from "./get-data-orders-refresh.service";
import { OrderElementStatusChangeRefreshService } from "./order-element-status-change-refresh.service";
import { CheckUpdatesService } from "./check-updates.service";

@NgModule({
  imports: [HttpClientModule],
  declarations: [],
  schemas: [NO_ERRORS_SCHEMA],
  providers: [
    AuthService,
    AuthSuccessRedirect,
    AuthFailRedirectGuard,
    AnchorService,
    SiteService,
    AddToCartService,
    CartSummaryUpdateService,
    OrderService,
    SoundService,
    CartService,
    TokenSqlService,
    OptionService,
    RefreshOrdersService,
    MessageService,
    SocketListenService,
    GetDataOrdersRefreshService,
    OrderElementStatusChangeRefreshService,
    CheckUpdatesService,
    CartCategoryService,
    MenuCategoryService,
    RefreshAfterDeleteOrderService
  ],
})
export class ServicesModule { }
