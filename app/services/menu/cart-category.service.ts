import { Observable } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { CartCategory } from "~/models/cart-category";
import { API_URL } from "~/config";
import { MenuElement } from "~/models/menu-element";

@Injectable({
  providedIn: "root",
})
export class CartCategoryService {
  constructor(private httpClient: HttpClient) { }

  getCategories(): Observable<CartCategory[]> {
    return this.httpClient.get<CartCategory[]>(API_URL + "/api/data/cart/categories");
  }
  getElementsFromCart(id: number): Observable<MenuElement[]> {
    return this.httpClient.get<MenuElement[]>(API_URL + "/api/cart-category/get/cart/elements/" + id);
  }

  getPlusCartsFull(): Observable<CartCategory[]> {
    return this.httpClient.get<CartCategory[]>(API_URL + "/api/cart-category/get/plus/group");
  }

}
