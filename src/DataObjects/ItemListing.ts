export class Listing {
	listings: number;
	quantity: number;
	unit_price: number;
}

export class ItemListing {
	id: number;
	buys: Listing[];
	sells: Listing[];
}
