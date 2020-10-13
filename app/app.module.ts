import { ReservationsModule } from './reservations/reservations.module';
import { StatsModule } from './stats/stats.module';
import { NgModule, NgModuleFactoryLoader, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptModule } from "nativescript-angular/nativescript.module";
import { SocketIOModule } from "nativescript-socketio/angular";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { ServicesModule } from "./services/services.module";
import { NativeScriptCommonModule } from "@nativescript/angular";
import { NativeScriptUIGaugeModule } from "nativescript-ui-gauge/angular";
import { WaiterModule } from "./waiter/waiter.module";
import { AdminModule } from "./admin/admin.module";
import { WEBSOCKET_URL } from './config';

@NgModule({
  bootstrap: [AppComponent],
  imports: [
    NativeScriptModule,
    NativeScriptCommonModule,
    NativeScriptUIGaugeModule,
    AppRoutingModule,
    SocketIOModule.forRoot(WEBSOCKET_URL), //http://192.168.0.206:3000 //https://app.miseczkaoshin.pl
    ServicesModule,
    WaiterModule,
    AdminModule,
    StatsModule,
    ReservationsModule,
  ],
  declarations: [AppComponent],
  schemas: [NO_ERRORS_SCHEMA],
})
export class AppModule { }
