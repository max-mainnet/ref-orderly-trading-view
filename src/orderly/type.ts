export interface OrderlyOrder {
  symbol: string;
  client_order_id?: string;
  order_type: 'LIMIT' | 'MARKET' | 'IOC' | 'FOK' | 'POST_ONLY' | 'ASK' | 'BID';
  order_price?: number;
  order_quantity?: number;
  order_amount?: number;
  side: 'BUY' | 'SELL';
  broker_id?: string;
  visible_quantity?: number;
}

export interface EditOrderlyOrder extends OrderlyOrder {
  order_id: number;
}

export interface OrderlyWSConnection extends Record<string, any> {
  id?: string;
  event: 'ping' | 'auth' | 'request' | 'subscribe' | 'unsubscribe';
  topic?: string;
  params?: any;
}

export interface Orders {
  symbol: string;
  ts: number;
  asks: number[][];
  bids: number[][];
}

export interface MarketTrade {
  symbol: string;
  price: number;
  size: number;
  side: 'BUY' | 'SELL';
}

export interface Trade {
  symbol: string;
  side: 'BUY' | 'SELL';
  executed_price: number;
  executed_quantity: number;
  executed_timestamp: number;
}

export interface Ticker {
  symbol: string;
  open: number;
  close: number;
  high: number;
  low: number;
  volume: number;
  amount: number;
  count: number;
}

export interface TokenInfo {
  token: string;
  token_account_id: string;
  decimals: number;
  minimum_increment: number;
}

export interface Holding {
  token: string;
  holding: number;
  frozen: number;
  pending_short: number;
  updated_time: number;
}

export interface ClientInfo {
  account_id: string;
  email: string;
  account_mode: string;
  tier: string;
  taker_fee_rate: number;
  maker_fee_rate: number;
  maintenance_cancel_orders: boolean;
}

export interface MarkPrice {
  symbol: string;
  price: number;
}

export interface Balance {
  holding: number;
  frozen: number;
  interest: number;
  pendingShortQty: number;
  pendingExposure: number;
  pendingLongQty: number;
  pendingLongExposure: number;
  version: number;
  staked: number;
  unbonding: number;
  vault: number;
  averageOpenPrice: number;
  pnl24H: number;
  fee24H: number;
  markPrice: number;
}
