import { MenuElement } from "./../../models/menu-element";
import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { SiteElement } from "~/models/site";
import { Anchor } from "~/models/anchor";
import { SITE_URL } from "~/config";

@Component({
  selector: "app-admin-element-desc-element",
  templateUrl: "./admin-element-desc-element.component.html",
  styleUrls: ["./admin-element-desc-element.component.scss"],
})
export class AdminElementDescElementComponent implements OnInit {
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
