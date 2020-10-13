import { TokenSqlService } from "./token-sql.service";
import { Injectable } from "@angular/core";
import { HttpClient, HttpResponse, HttpHeaders } from "@angular/common/http";
import { API_TOKEN, API_URL } from "~/config";
import { UserRegister } from "../models/user-register";
import { TokenBase, TokenResponse } from "~/models/token-base";

@Injectable()
export class AuthService {
  constructor(
    private httpClient: HttpClient,
    private tokenSqlService: TokenSqlService
  ) { }

  async checkBaseAuth(token: TokenBase | any): Promise<{ success: boolean }> {
    let options = {
      headers: new HttpHeaders({
        "Content-type": "application/json",
      }),
    };
    return this.httpClient
      .post<{ success: boolean }>(
        API_URL + "/api/auth/token/check",
        token,
        options
      )
      .toPromise();
  }


  async checkAuth(): Promise<boolean> {
    var tokenFromSql: {
      success: boolean;
      token: TokenBase | null;
    } = await this.tokenSqlService.getTokenDataIfExists();
    if (!tokenFromSql.success) {
      return false;
    }
    var r: { success: boolean } = await this.checkBaseAuth(
      tokenFromSql
    );
    if (!r.success) {
      return false;
    }
    return true;
  }

  async loginAuth(nick: string, password: string, role: string): Promise<{ success: boolean, token: TokenBase | null }> {
    let options = {
      headers: new HttpHeaders({
        "Content-type": "application/json",
      }),
    };
    var tokenResponse: TokenResponse = await this.httpClient.post<TokenResponse>(
      API_URL + "/api/auth/login/app",
      { nick, password, role },
      options
    ).toPromise()
    if (tokenResponse.success) {
      await this.tokenSqlService.addToken(tokenResponse)
      return await this.tokenSqlService.getTokenDataIfExists()
    }


    return { success: false, token: null }

  }

  async getTokenCheckIsExpire(): Promise<any> {
    var tokenFromSql: {
      success: boolean;
      token: TokenBase | null;
    } = await this.tokenSqlService.getTokenDataIfExists();
    if (!tokenFromSql.success) {
      return false;
    }
    // console.log(tokenFromSql.token)
    return await this.checkBaseAuth(tokenFromSql.token)
  }

  async getTokenUser(): Promise<
    TokenBase | null
  > {
    return await this.tokenSqlService.getTokenUser();
  }

  async logOut() {
    await this.tokenSqlService.clearTokensTable()
  }

  checkPassword(password: string): Promise<{ success: boolean }> {
    return this.httpClient.post<{ success: boolean }>(API_URL + '/api/auth/check/password', { password }).toPromise()
  }

}
