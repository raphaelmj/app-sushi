import { MenuElement } from "./../../models/menu-element";
import { Component, OnInit, Input, EventEmitter, Output } from "@angular/core";
import { Anchor } from "~/models/anchor";
import { SiteElement } from "~/models/site";
import { SITE_URL } from "~/config";

@Component({
  selector: "app-admin-element-many-names",
  templateUrl: "./admin-element-many-names.component.html",
  styleUrls: ["./admin-element-many-names.component.scss"],
})
export class AdminElementManyNamesComponent implements OnInit {
  @Output() emitAdd: EventEmitter<{
    element: MenuElement;
    index: number;
    priceNameIndex: number | null;
    asSimple?: boolean;
  }> = new EventEmitter<{
    element: MenuElement;
    index: number;
    priceNameIndex: number | null;
    asSimple?: boolean;
  }>();
  @Input() element: MenuElement;
  siteUrl: string = SITE_URL;

  constructor() { }

  ngOnInit(): void { }

  addToCart(index: number) {
    this.emitAdd.emit({ element: this.element, index, priceNameIndex: null, asSimple: false });
  }

}
