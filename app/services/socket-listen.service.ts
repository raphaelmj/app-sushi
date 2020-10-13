import { RefreshAfterCronInprogressService } from './refresh-after-cron-inprogress.service';
import { RefreshAfterDeleteOrderService } from './refresh-after-delete-order.service';
import { CartOrder } from '~/models/cart-order';
import { CartService } from '~/services/cart.service';
import { Injectable, NgZone } from "@angular/core";
import { SocketIO } from "nativescript-socketio/socketio";
import { TokenBase } from "~/models/token-base";
import { MessageService } from "./message.service";
import { GetDataOrdersRefreshService } from "./get-data-orders-refresh.service";
import { OrderElementStatusChangeRefreshService } from "./order-element-status-change-refresh.service";
import { TNSPlayer } from "nativescript-audio";
import { SoundService } from "./sound.service";

export interface SocketOrderResponse {
  order: CartOrder
  uuid: string
}

@Injectable({
  providedIn: "root",
})
export class SocketListenService {
  tokenUser: TokenBase;
  p1: TNSPlayer;
  p2: TNSPlayer;
  p3: TNSPlayer;
  p4: TNSPlayer;
  p5: TNSPlayer;
  constructor(
    private socketIO: SocketIO,
    private messageService: MessageService,
    private ngZone: NgZone,
    private getDataOrdersRefreshService: GetDataOrdersRefreshService,
    private orderElementStatusChangeRefreshService: OrderElementStatusChangeRefreshService,
    private refreshAfterDeleteOrderService: RefreshAfterDeleteOrderService,
    private refreshAfterCronInprogressService: RefreshAfterCronInprogressService,
    private soundService: SoundService,
    private cartService: CartService
  ) {
    this.p1 = this.soundService.createPlayer("~/assets/ping.mp3", false);
    this.p2 = this.soundService.createPlayer("~/assets/end.mp3", false);
    this.p3 = this.soundService.createPlayer("~/assets/change.mp3", false);
    this.p4 = this.soundService.createPlayer("~/assets/bonus.mp3", false);
    this.p5 = this.soundService.createPlayer("~/assets/inprogress.mp3", false);

  }
  startListen(tokenUser: TokenBase) {
    this.tokenUser = tokenUser;
    if (!this.socketIO.connected) {
      this.socketIO.connect();
      this.listenAddOrder();
      this.listenChangeOrder();
      this.listenQuietChangeOrder();
      this.listenToReadyIfWaiter();
      this.listenToOrderStatusChange();
      this.listenToOrderElementStatusChange();
      this.listenToTimeChange();
      this.listenToOrderDelete();
      this.listenBonusUsed()
      this.listenInProgress()
    }
  }

  disconnectSocket() {
    this.socketIO.disconnect();
  }

  get connected() {
    return this.socketIO.connected;
  }

  listenAddOrder() {
    this.socketIO.on("orderCreateFront", (data: SocketOrderResponse) => {
      this.ngZone.run(() => {
        this.getDataOrdersRefreshService.refresh(data.uuid, data.order);
        if (this.tokenUser.user.role == "admin") {
          this.p1.play();
          var nr: string = this.cartService.getOrderNumber(data.order.endDay, new Date(), data.order)
          // this.messageService.showAlert(
          //   "Nowe zamówienie numer: " + nr + "."
          // );
        }
      });
    });
  }

  listenChangeOrder() {
    this.socketIO.on("orderUpdate", (data: SocketOrderResponse) => {
      this.ngZone.run(() => {
        this.getDataOrdersRefreshService.refresh(data.uuid, data.order);
        if (this.tokenUser.user.role == "admin") {
          this.p3.play();
          var nr: string = this.cartService.getOrderNumber(data.order.endDay, new Date(), data.order)
          // this.messageService.showAlert(
          //   "zamówienie o numerze " + nr + " zostało zaktualizowane."
          // );
        }
      });
    });
  }

  listenQuietChangeOrder() {
    this.socketIO.on("orderQuietUpdate", (data: SocketOrderResponse) => {
      this.ngZone.run(() => {
        this.getDataOrdersRefreshService.refresh(data.uuid, data.order);
      });
    });
  }

  listenToReadyIfWaiter() {
    if (this.tokenUser.user.role == "waiter") {
      this.socketIO.on("orderReady", (data: SocketOrderResponse) => {
        this.ngZone.run(() => {
          this.p2.play();
          var nr: string = this.cartService.getOrderNumber(data.order.endDay, new Date(), data.order)
          // this.messageService.showAlert(
          //   "zamówienie o numerze " + nr + " jest gotowe."
          // );
        });
      });
    }
  }

  listenToOrderStatusChange() {
    this.socketIO.on("orderUpdateStatus", (data) => {
      this.ngZone.run(() => {
        this.getDataOrdersRefreshService.refresh(data.uuid, data.order);
      });
    });
  }

  listenToOrderElementStatusChange() {
    this.socketIO.on("orderUpdateElementStatus", (data) => {
      this.ngZone.run(() => {
        // this.getDataOrdersRefreshService.refresh(data.uuid);
        this.orderElementStatusChangeRefreshService.updateStatus(data);
      });
    });
  }

  listenToTimeChange() {
    this.socketIO.on("orderUpdateTime", (data: SocketOrderResponse) => {
      this.ngZone.run(() => {
        this.p3.play();
        this.getDataOrdersRefreshService.refresh(data.uuid, data.order);
      });
    });
  }

  listenToOrderDelete() {
    this.socketIO.on("orderDelete", (data: SocketOrderResponse) => {
      this.ngZone.run(() => {
        this.p3.play();
        this.refreshAfterDeleteOrderService.updateAfterDelete(data.uuid)
      });
    });
  }


  listenBonusUsed() {
    this.socketIO.on("bonusUsed", (data: SocketOrderResponse) => {
      this.ngZone.run(() => {
        if (data.order.bonusUsed)
          this.p4.play();
        this.getDataOrdersRefreshService.refresh(data.uuid, data.order);
      });
    });
  }


  listenInProgress() {
    this.socketIO.on("changeInProgress", (data: { isChanged: boolean }) => {
      // console.log(data)
      this.ngZone.run(() => {
        if (this.tokenUser.user.role == "admin") {
          if (data.isChanged) {
            this.p5.play()
          }
        }
        this.refreshAfterCronInprogressService.emitRefresh(data.isChanged)
      });
    });
  }

}
