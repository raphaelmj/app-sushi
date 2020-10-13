import { Injectable } from "@angular/core";
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
} from "@angular/router";
import { Observable } from "rxjs";
import { AuthService } from "../../services/auth.service";
import { DB_FILE } from "~/config";
import { TokenBase, TokenData } from "../../models/token-base";
var Sqlite = require("nativescript-sqlite");

@Injectable({
  providedIn: "root",
})
export class AuthFailRedirectGuard implements CanActivate {
  database: any;
  constructor(private router: Router, private authServive: AuthService) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    return this.authServive.getTokenCheckIsExpire().then(r => {
      // console.log(r)
      if (!r.success) {
        this.router.navigate(['/login'])
      }
      return r.success;
    }).catch(err => {
      this.router.navigate(['/login'])
      return false
    })

  }
}
