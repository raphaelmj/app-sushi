import { Injectable } from '@angular/core';
import { Device, screen } from "tns-core-modules/platform";
import { on } from "tns-core-modules/application";
import { device } from "platform";
import { Orientation } from 'tns-core-modules/ui/layouts/stack-layout';
import { Subject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class OrientationChangeService {

  action$: Subject<{ orient: Orientation, deviceType: 'Phone' | 'Tablet', width?: number, height?: number }> = new Subject<{ orient: Orientation, deviceType: 'Phone' | 'Tablet', width: number, height?: number }>()
  orient: Orientation
  device: Device = device
  width: number
  height: number

  constructor() {
    this.orient = (screen.mainScreen.widthDIPs > screen.mainScreen.heightDIPs) ? "horizontal" : "vertical"
    this.width = (screen.mainScreen.widthDIPs > screen.mainScreen.heightDIPs) ? screen.mainScreen.widthDIPs : screen.mainScreen.heightDIPs
    this.height = (screen.mainScreen.widthDIPs > screen.mainScreen.heightDIPs) ? screen.mainScreen.heightDIPs : screen.mainScreen.widthDIPs
    this.changeOrientationObserve()
  }

  changeEmit() {
    this.action$.next({ orient: this.orient, deviceType: this.device.deviceType, width: this.width, height: this.height })
  }

  changeOrientationObserve() {
    on("orientationChanged", (evt) => {
      switch (evt.newValue) {
        case "portrait":
          this.orient = "vertical"

          break;

        case "landscape":
          this.orient = "horizontal"
          break
      }
      this.width = (screen.mainScreen.widthDIPs > screen.mainScreen.heightDIPs) ? screen.mainScreen.widthDIPs : screen.mainScreen.heightDIPs
      this.height = (screen.mainScreen.widthDIPs > screen.mainScreen.heightDIPs) ? screen.mainScreen.heightDIPs : screen.mainScreen.widthDIPs
      this.changeEmit()
    });
  }

}
