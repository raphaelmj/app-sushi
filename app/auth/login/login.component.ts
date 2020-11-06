import { TokenSqlService } from './../../services/token-sql.service';
import { AuthService } from "./../../services/auth.service";
import { Component, OnInit } from "@angular/core";
import { Page } from "tns-core-modules/ui/page";
import * as application from "tns-core-modules/application";
import { Router } from "@angular/router";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { EventData } from "tns-core-modules/data/observable";
import { ListPicker } from "tns-core-modules/ui/list-picker";
import { SocketListenService } from "~/services/socket-listen.service";
import { TokenBase } from "~/models/token-base";

@Component({
  moduleId: module.id,
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
})
export class LoginComponent implements OnInit {
  emailRegex: any = /^[0-9a-z_.-]+@[0-9a-z.-]+\.[a-z]{2,3}$/;
  loading: boolean = false;
  loginFail: boolean = false;
  formLogin: FormGroup;
  input: any = {
    nick: "admin",
    password: "admin",
  };
  selectedType: string = "Kelner";
  loginTypesMap: Map<string, string> = new Map([
    ["Kelnerka", "waiter"],
    ["Kuchnia", "admin"],
  ]);
  loginTypes: Array<string> = ["Kelnerka", "Kuchnia"];

  constructor(private page: Page, private authService: AuthService, private router: Router, private fb: FormBuilder, private tokenSqlService: TokenSqlService) {
    this.page.actionBarHidden = true;
    let activity = application.android.startActivity;
    activity.getWindow().addFlags(android.view.View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN);
  }

  ngOnInit() {
    this.tokenSqlService.dropTokensTable().then(r => {
      this.tokenSqlService.createTokenTable()
    })
    this.createForm();
  }

  createForm() {
    this.formLogin = this.fb.group({
      nick: ["marcin", Validators.required], //admin
      password: ["super", Validators.required], //kampiooshinek21
    });
  }

  public onSelectedIndexChanged(args: EventData) {
    const picker = <ListPicker>args.object;
    this.selectedType = this.loginTypesMap.get(this.loginTypes[picker.selectedIndex]);
  }


  submitForm() {
    this.loginFail = false;
    if (this.formLogin.valid) {
      this.loading = true;
      this.authService.loginAuth(this.formLogin.get("nick").value, this.formLogin.get("password").value, this.selectedType).then((r) => {
        this.loading = false;
        if (r.success) {
          switch (r.token.user.role) {
            case "waiter":
              this.router.navigate(["/home"]);
              break;

            case "admin":
              this.router.navigate(["/admin"]);
              break;
          }
        } else {
          this.loginFail = true;
        }
      });
    }
  }
}
