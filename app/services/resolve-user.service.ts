import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { TokenBase } from '~/models/token-base';
import { TokenSqlService } from './token-sql.service';

@Injectable({
  providedIn: 'root'
})
export class ResolveUserService implements Resolve<TokenBase | null> {

  constructor(private tokenSqlService: TokenSqlService) { }
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<TokenBase | null> {
    // console.log('resolve user')
    return this.tokenSqlService.getTokenUser()
  }
}
