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
		return this.buys.reduce((a: number, b: Listing) => a + b.quantity, 0);
	}

	sumSells(): number {
		return this.sells.reduce((a: number, b: Listing) => a + b.quantity, 0);
	}

}
