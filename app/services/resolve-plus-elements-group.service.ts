import { CartCategoryService } from './menu/cart-category.service';
import { Observable } from 'rxjs';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { CartCategory } from '~/models/cart-category';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ResolvePlusElementsGroupService implements Resolve<CartCategory[]> {

  constructor(private cartCategoryService: CartCategoryService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): CartCategory[] | Observable<CartCategory[]> | Promise<CartCategory[]> {
    return this.cartCategoryService.getPlusCartsFull()
  }
}
