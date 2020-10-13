import { Injectable } from "@angular/core";
import { Subject } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class OrderElementStatusChangeRefreshService {
  action$: Subject<{
    orderId: number;
    elementId: number;
    status: boolean;
  }> = new Subject<{ orderId: number; elementId: number; status: boolean }>();

  constructor() {}

  updateStatus(data: { orderId: number; elementId: number; status: boolean }) {
    this.action$.next(data);
  }
}
