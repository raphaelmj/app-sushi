import { Observable } from "rxjs";
import { API_URL } from "~/config";
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { MenuCategory } from "~/models/menu-category";

@Injectable({
  providedIn: "root",
})
export class MenuCategoryService {
  constructor(private httpClient: HttpClient) {}

  getMenuFull(): Observable<MenuCategory[]> {
    return this.httpClient.get<MenuCategory[]>(API_URL + "/api/data/menu/all");
  }
}
