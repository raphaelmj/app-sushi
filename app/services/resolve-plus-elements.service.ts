import { MenuElement } from '~/models/menu-element';
import { CartCategoryService } from './menu/cart-category.service';
import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { SiteElement } from '~/models/site';
import { Observable } from 'rxjs';
import { SiteService } from './sites/site.service';

@Injectable({
  providedIn: 'root'
})
export class ResolvePlusElementsService implements Resolve<SiteElement[]> {

  constructor(private siteService: SiteService, private cartCategoryService: CartCategoryService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): SiteElement[] | MenuElement[] | Observable<SiteElement[] | MenuElement[]> | Promise<SiteElement[] | MenuElement[]> {
    return this.cartCategoryService.getElementsFromCart(6)
  }
}
