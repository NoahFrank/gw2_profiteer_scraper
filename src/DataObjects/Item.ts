export interface Stock {
  quantity: number;
  unit_price: number;
}

export interface Item {
  id: number;
  whitelisted: boolean;
  buys: Stock;
  sells: Stock;
}
