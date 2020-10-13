import { TokenSqlService } from "./../token-sql.service";
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

@Injectable()
export class AuthSuccessRedirect implements CanActivate {
  database: any;
  constructor(private router: Router, private authServive: AuthService) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    return this.authServive.getTokenCheckIsExpire().then(r => {
      // console.log(r)
      if (r.success) {
        switch (r.user.role) {
          case 'waiter':
            this.router.navigate(['/home'])
            break
          case 'admin':
            this.router.navigate(['/admin'])
            break
        }
      }
      return !r.success;
    }).catch(err => {
      this.router.navigate(['/login'])
      return true
    })
  }


}
