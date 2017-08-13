export class Stock {
	quantity: number;
	unit_price: number;
}

export class Item {
	id: number;
	buys: Stock;
	sells: Stock;
}
