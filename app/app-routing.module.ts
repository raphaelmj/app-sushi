import { NgModule } from "@angular/core";
import { Routes } from "@angular/router";
import { NativeScriptRouterModule } from "nativescript-angular/router";
import { AuthFailRedirectGuard } from "./services/guard/auth-fail-redirect.guard";
import { AuthSuccessRedirect } from "./services/guard/auth-success-redirect";

const routes: Routes = [
  { path: "", redirectTo: "/login", pathMatch: "full" },
  // {
  //   path: "home",
  //   loadChildren: () => import("./home/home.module").then((m) => m.HomeModule),
  //   canActivate: [AuthFailRedirectGuard]
  // },
  {
    path: "login",
    loadChildren: () => import("./auth/auth.module").then((m) => m.AuthModule),
    canActivate: [AuthSuccessRedirect],
  },
  // {
  //   path: "admin",
  //   loadChildren: () => import("./admin/admin.module").then((m) => m.AdminModule),
  //   canActivate: [AuthFailRedirectGuard]
  // },
  // {
  //   path: "home",
  //   loadChildren: () => import("./waiter/waiter.module").then((m) => m.WaiterModule),
  //   canActivate: [AuthFailRedirectGuard]
  // },
];

@NgModule({
  imports: [NativeScriptRouterModule.forRoot(routes)],
  exports: [NativeScriptRouterModule],
})
export class AppRoutingModule { }
