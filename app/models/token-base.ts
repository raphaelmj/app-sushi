export enum UserPerm {
  super = 'superadmin',
  normal = 'normal',
}
export enum UserRole {
  waiter = 'waiter',
  admin = 'admin',
}
export interface TokenData {
  id: number
  nick: string;
  role: UserRole,
  permission?: UserPerm
}
export interface TokenBase {
  id: number;
  token: string;
  user: TokenData
  exp: string;
}
export interface UserInfo {
  id?: number
  nick: string
  role: UserRole,
  permission?: UserPerm
}
export interface TokenResponse {
  success: boolean
  access_token: string | null,
  user?: UserInfo
  exp: number
}
