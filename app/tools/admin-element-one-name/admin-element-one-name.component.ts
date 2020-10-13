import { MenuCategory } from "./../../models/menu-category";
import { MenuElement } from "./../../models/menu-element";
import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { Anchor } from "~/models/anchor";
import { SiteElement } from "~/models/site";
import { SITE_URL } from "~/config";

@Component({
  selector: "app-admin-element-one-name",
  templateUrl: "./admin-element-one-name.component.html",
  styleUrls: ["./admin-element-one-name.component.scss"],
})
export class AdminElementOneNameComponent implements OnInit {
  @Output() emitAdd: EventEmitter<{
    element: MenuElement;
    index: number | null;
    priceNameIndex: number | null;
    asSimple?: boolean;
  }> = new EventEmitter<{
    element: MenuElement;
    index: number | null;
    priceNameIndex: number | null;
    asSimple?: boolean;
  }>();
  @Input() element: MenuElement;
  siteUrl: string = SITE_URL;
  countPrices: number = 1

  constructor() { }

  ngOnInit(): void {
    this.element.description = this.element.description.replace(/(<([^>]+)>)/gi, "");
    this.countPrices = this.element.price.length
    this.showPriceVersion()
  }

  showPriceVersion() {

  }

  addToCart() {
    this.emitAdd.emit({ element: this.element, index: null, priceNameIndex: null, asSimple: false });
  }

}
