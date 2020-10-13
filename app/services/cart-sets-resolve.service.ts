import { CartCategoryService } from './menu/cart-category.service';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { MenuElement } from '~/models/menu-element';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class CartSetsResolveService implements Resolve<MenuElement[]> {

  constructor(private cartCategoryService: CartCategoryService) { }
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): MenuElement[] | Observable<MenuElement[]> | Promise<MenuElement[]> {
    return this.cartCategoryService.getElementsFromCart(3)
  }
}
