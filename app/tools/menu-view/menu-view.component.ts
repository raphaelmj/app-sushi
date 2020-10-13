import { Subscription } from 'rxjs';
import { OrderQueryParams } from '~/models/order-query-params';
import { OrderService } from '~/services/orders/order.service';
import { Component, OnInit, Input, OnDestroy } from "@angular/core";
import { TokenBase } from "~/models/token-base";
import { ActivatedRoute, Router } from "@angular/router";
import { AuthService } from "~/services/auth.service";
import { CheckUpdatesService } from "~/services/check-updates.service";
import { RouterExtensions } from "@nativescript/angular";
import * as moment from "moment";

@Component({
  selector: "app-menu-view",
  templateUrl: "./menu-view.component.html",
  styleUrls: ["./menu-view.component.scss"],
})
export class MenuViewComponent implements OnInit, OnDestroy {
  @Input() tokenUser: TokenBase;
  @Input() name: string = "";
  @Input() day: Date
  subQP: Subscription

  constructor(
    public router: Router,
    private activatedRoute: ActivatedRoute,
    private authService: AuthService,
    private checkUpdatesService: CheckUpdatesService,
    private routerExtensions: RouterExtensions
  ) { }


  ngOnInit(): void { }

  logOut() {
    this.authService.logOut().then((r) => {
      this.router.navigate(["/login"]);
    });
  }
  checkUpdates() {
    this.checkUpdatesService.syncWithAppSyncServer(true);
  }

  goToReserve() {
    if (!this.day) {
      var d: string = moment().format("yy-MM-DD");
    } else {
      var d: string = moment(this.day).format("yy-MM-DD");
    }
    this.activatedRoute.queryParams.subscribe(p => {
      // console.log(p)
      if (p != {}) {
        var urlStr: string = this.paramsToUrl(p)
        // console.log(urlStr)
        this.routerExtensions.navigate(['/reservations'], { queryParams: { backTo: this.router.url + '?' + urlStr, day: d } })
      } else {
        this.routerExtensions.navigate(['/reservations'], { queryParams: { backTo: this.router.url, day: d } })
      }

    })

  }


  paramsToUrl(qp: {}): string {
    var uri: string = ""
    Object.keys(qp).map((k, i) => {
      uri += `${k}=${qp[k]}`
      if (i < (Object.keys(qp).length - 1)) {
        uri += "&"
      }
    })
    return uri
  }

  ngOnDestroy(): void {
    if (this.subQP)
      this.subQP.unsubscribe()
  }

}
