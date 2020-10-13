import { MenuElement } from "./../../models/menu-element";
import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { SiteElement, ElementPrice } from "~/models/site";
import { Anchor } from "~/models/anchor";
import { SITE_URL } from "~/config";
import { PriceConfigSort } from "~/models/price-config-sort";

@Component({
  selector: "app-admin-element-config-price",
  templateUrl: "./admin-element-config-price.component.html",
  styleUrls: ["./admin-element-config-price.component.scss"],
})
export class AdminElementConfigPriceComponent implements OnInit {
  @Output() emitAdd: EventEmitter<{
    element: MenuElement;
    index: number;
    priceNameIndex: number | null,
    asSimple?: boolean;
  }> = new EventEmitter<{
    element: MenuElement;
    index: number;
    priceNameIndex: number | null;
    asSimple?: boolean;
  }>();
  @Input() element: MenuElement;
  siteUrl: string = SITE_URL;
  prices: PriceConfigSort[] = [];

  constructor() { }

  ngOnInit(): void {
    // this.element.description = this.element.description.replace(
    //   /(<([^>]+)>)/gi,
    //   ""
    // );
    this.prices = this.preparePriceConfigArray(this.element.price);
  }

  addToCart() {
    this.emitAdd.emit({ element: this.element, index: null, priceNameIndex: null, asSimple: false });
  }


  preparePriceConfigArray(price: ElementPrice[]): PriceConfigSort[] {
    var pConfig: PriceConfigSort[] = [];
    // arraySort(price, 'perSize')
    price.forEach((element, i) => {
      var isPer = false;

      pConfig.map((cel, j) => {
        if (cel.perSize == element.perSize) {
          isPer = true;
          pConfig[j].data.push({
            price: element.price,
            isSea: element.isSea,
            indexInElement: i,
          });
        }
      });

      if (!isPer) {
        var firstElement = [
          {
            price: element.price,
            isSea: element.isSea,
            indexInElement: i,
          },
        ];
        pConfig.push({
          perSize: element.perSize,
          data: firstElement,
        });

        // console.log(pConfig)
      }
    });

    return pConfig;
  }

  arraySortisSea(data: Array<{ price: string; isSea: boolean }>): Array<{ price: string; isSea: boolean }> {
    return data;
  }
}
