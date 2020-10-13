import { TokenSqlService } from './token-sql.service';
import { Injectable } from "@angular/core";
import { APPSYNC_ANDROID_PRODUCTION_KEY } from "~/config";
import { AppSync, InstallMode, SyncStatus } from "nativescript-app-sync";
import * as Toast from "nativescript-toast";

@Injectable({
  providedIn: "root",
})
export class CheckUpdatesService {
  constructor() { }

  syncWithAppSyncServer(toastDo: boolean = false): void {
    // console.log("Querying AppSync..");
    if (toastDo) Toast.makeText("Zaczynamy wyszukiwanie aktualizacji", "long").show();
    AppSync.sync(
      {
        deploymentKey: APPSYNC_ANDROID_PRODUCTION_KEY,
        installMode: InstallMode.IMMEDIATE,
        mandatoryInstallMode: InstallMode.IMMEDIATE,
        updateDialog: {
          // only used for InstallMode.IMMEDIATE
          optionalUpdateMessage: "Aplikacja uruchomi się w najnowszej wersji",
          updateTitle: "Proszę zrestaturtuj aplikację",
          mandatoryUpdateMessage: "Mandatory update msg",
          optionalIgnoreButtonLabel: "Poźniej",
          mandatoryContinueButtonLabel: "Zrestartuj teraz",
          appendReleaseDescription: true,
        },
      },
      (syncStatus: SyncStatus): void => {
        if (syncStatus === SyncStatus.UP_TO_DATE) {
          // console.log("AppSync: up to date");
          if (toastDo) Toast.makeText("Wersja jest aktualna.", "long").show();
        } else if (syncStatus === SyncStatus.UPDATE_INSTALLED) {
          // console.log("AppSync: update installed");
          if (toastDo) Toast.makeText("Aktualizacja zainstalowana.", "long").show();
        } else {
          // console.log("AppSync: sync status: " + syncStatus);
          if (toastDo && syncStatus != SyncStatus.ERROR) Toast.makeText("Status aktualizacji: " + syncStatus, "long").show();
        }
      }
    );
  }
}
