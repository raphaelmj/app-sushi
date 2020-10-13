import { MenuCategoryService } from "./menu-category.service";
import { Observable } from "rxjs";
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { Injectable } from "@angular/core";
import { MenuCategory } from "~/models/menu-category";

@Injectable({
  providedIn: "root",
})
export class MenuCategoriesAllResolveService implements Resolve<MenuCategory[]> {
  constructor(private menuCategoryService: MenuCategoryService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): MenuCategory[] | Observable<MenuCategory[]> | Promise<MenuCategory[]> {
    return this.menuCategoryService.getMenuFull();
  }
}
