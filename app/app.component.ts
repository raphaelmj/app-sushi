import { Component } from "@angular/core";
import { AppSync, InstallMode, SyncStatus } from "nativescript-app-sync";
// import { isIOS } from "tns-core-modules/platform";
import * as application from "tns-core-modules/application";
import { CheckUpdatesService } from "./services/check-updates.service";

@Component({
  styles: ["app.scss"],
  selector: "ns-app",
  templateUrl: "app.component.html",
})
export class AppComponent {
  constructor(private checkUpdatesService: CheckUpdatesService) {
    application.on(application.resumeEvent, () => {
      this.checkUpdatesService.syncWithAppSyncServer(false);
    });
  }


  ngOnDestroy(): void { }
}
