import { Injectable } from "@angular/core";
import { DB_FILE } from "~/config";
import { TokenBase, TokenData, TokenResponse } from "../models/token-base";
var Sqlite = require("nativescript-sqlite");

@Injectable()
export class TokenSqlService {
  db: typeof Sqlite;

  constructor() {
    if (!Sqlite.exists(DB_FILE)) {
      Sqlite.copyDatabase(DB_FILE);
    }
  }

  async createTokenTable(): Promise<any> {
    var d = await (new Sqlite(DB_FILE))
    return await d.execSQL(
      "CREATE TABLE IF NOT EXISTS tokens (id INTEGER PRIMARY KEY AUTOINCREMENT, token TEXT, token_data TEXT, role VARCHAR(50),permission VARCHAR(50),expire_date DATETIME,create_date DATETIME)"
    )
  }

  async clearTokensTable(): Promise<any> {
    await this.createTokenTable()
    var d = await (new Sqlite(DB_FILE))
    return await d.execSQL("DELETE FROM tokens");
  }

  async dropTokensTable(): Promise<any> {
    await this.createTokenTable()
    var d = await (new Sqlite(DB_FILE))
    return await d.execSQL("DROP TABLE IF EXISTS tokens");
  }

  async getTokens(): Promise<any[]> {
    await this.createTokenTable()
    var d = await (new Sqlite(DB_FILE))
    return await d.all("SELECT * FROM tokens");
  }


  async addToken(tokenResponse: TokenResponse) {
    await this.createTokenTable()
    var d = await (new Sqlite(DB_FILE))
    await this.clearTokensTable();
    return await d.execSQL(
      "INSERT INTO tokens(id,token,token_data,expire_date,role,permission) VALUES(?,?,?,?,?,?)",
      [tokenResponse.user.id, tokenResponse.access_token, JSON.stringify(tokenResponse.user), new Date(tokenResponse.exp), new Date()]
    )
  }


  refactorToken(array: any[]): TokenBase {
    return {
      id: array[0],
      token: array[1],
      user: JSON.parse(array[2]),
      exp: array[3]
    }
  }


  async getTokenDataIfExists(): Promise<{
    success: boolean;
    token: TokenBase | null
  }> {
    var t: any[] = await this.getTokens()
    if (t.length > 0) {
      return { success: true, token: this.refactorToken(t[0]) };
    }
    return { success: false, token: null };
  }


  async getTokenUser(): Promise<
    TokenBase | null
  > {
    var t: any[] = await this.getTokens()
    if (t.length > 0) {
      return this.refactorToken(t[0])
    }
    return null
  }



}
