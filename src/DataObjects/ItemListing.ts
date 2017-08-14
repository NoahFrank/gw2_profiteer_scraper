export class Listing {
	listings: number;
	quantity: number;
	unit_price: number;
}

export class ItemListing {
	id: number;
	buys: Listing[];
	sells: Listing[];

	sumBuys(): number {
		let sum = 0;
		for (let buy of this.buys) {
			sum += buy.quantity;
		}
		return sum;
	}

	sumSells(): number {
		let sum = 0;
		for (let sell of this.sells) {
			sum += sell.quantity;
		}
		return sum;
	}
}
