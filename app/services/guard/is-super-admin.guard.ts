import { TokenSqlService } from './../token-sql.service';
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class IsSuperAdminGuard implements CanActivate {
  constructor(private tokenSqlService: TokenSqlService) { }
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    return this.tokenSqlService.getTokenDataIfExists().then(r => {
      if (!r.success) {
        return false
      }
      if (r.success) {
        if (r.token.user.permission == 'superadmin') {
          return true
        } else {
          return false
        }
      }
    })


  }

}
