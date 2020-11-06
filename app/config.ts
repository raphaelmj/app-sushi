import { OrderQueryParams } from './models/order-query-params';
export const API_URL = 'http://localhost:3000';
export const WEBSOCKET_URL = "http://localhost:3000";


export const API_TOKEN = "94F754AC8F1AA6C8F73DF2BD41A24";
export const DB_FILE = "mydb.db";
export const SITE_URL = "https://weburl.pl";


export const APPSYNC_ANDROID_PRODUCTION_KEY = "2RtJmGONNDItJNFd1lL1Iv4E0oBf7B2rruIUU";
export const APPSYNC_ANDROID_STAGING_KEY = "HU1N2PtohuH6MugTAXlPqjyfwkaZ7B2rruIUU";

export const DEFAULT_ORDERS_QUERY_PARAMS: OrderQueryParams = {
  page: 1,
  sts: 'create|ready',
  paid: '0',
  reservation: 'all',
  inprogress: 'all'
}

export const LIMIT: number = 6;

export const PLUS_MINUTES = 5;

export const VERTICAL_GRID: Array<{ c: number; r: number }> = [
  { c: 0, r: 0 },
  { c: 1, r: 0 },
  { c: 2, r: 0 },
  { c: 0, r: 1 },
  { c: 1, r: 1 },
  { c: 2, r: 1 },
];

export const VERTICAL_GRID_MIN_TABLET: Array<{ c: number; r: number }> = [
  { c: 0, r: 0 },
  { c: 1, r: 0 },
  { c: 0, r: 1 },
  { c: 1, r: 1 },
  { c: 0, r: 2 },
  { c: 1, r: 2 },
];

export const VERTICAL_GRID_PHONE: Array<{ c: number; r: number }> = [
  { c: 0, r: 0 },
  { c: 0, r: 1 },
  { c: 0, r: 2 },
  { c: 0, r: 3 },
  { c: 0, r: 4 },
  { c: 0, r: 5 },
];
