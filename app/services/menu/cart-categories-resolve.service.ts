import { CartCategoryService } from "./cart-category.service";
import { Observable } from "rxjs";
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { Injectable } from "@angular/core";
import { CartCategory } from "~/models/cart-category";

@Injectable({
  providedIn: "root",
})
export class CartCategoriesResolveService implements Resolve<CartCategory[]> {
  constructor(private cartCategoryService: CartCategoryService) {}
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): CartCategory[] | Observable<CartCategory[]> | Promise<CartCategory[]> {
    return this.cartCategoryService.getCategories();
  }
}
