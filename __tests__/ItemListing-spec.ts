import * as fs from 'fs';

let now = require('performance-now');

import {ItemListing, Listing} from '../src/DataObjects/ItemListing';

test('sumBuys should sum and return the quantity element of Listing in buys', () => {
	let newBuys: Listing[] = [];

	for (let i = 1; i <= 100; i ++) { // Sum of 1-100 is 5050
		let newListing: Listing = new Listing();
		newListing.quantity = i;
		newListing.unit_price = 1;
		newListing.listings = 1;

		newBuys.push(newListing);
	}

	let newItemListing: ItemListing = new ItemListing();
	newItemListing.buys = newBuys;

	expect(newItemListing.sumBuys()).toBe(5050);
});

test('sumSells should sum and return the quantity element of Listing in sells', () => {
	let newSells: Listing[] = [];

	for (let i = 1; i <= 100; i ++) { // Sum of 1-100 is 5050
		let newListing: Listing = new Listing();
		newListing.quantity = i;
		newListing.unit_price = 1;
		newListing.listings = 1;

		newSells.push(newListing);
	}

	let newItemListing: ItemListing = new ItemListing();
	newItemListing.sells = newSells;

	expect(newItemListing.sumSells()).toBe(5050);
});

test('sumSells should be able to quickly sum fairly large amounts of data', () => {
	let data = fs.readFileSync('./__tests__/Resources/sumSells-test-data.json');
	let parsedData = JSON.parse(data.toString());

	let newItemListing: ItemListing = new ItemListing();
	newItemListing.sells = parsedData.sells;

	let t0 = now();
	let sum = newItemListing.sumSells();
	let t1 = now();

	let expectedSum = 0;
	for (let sell of parsedData.sells) {
		expectedSum += sell.quantity;
	}

	expect(t1 - t0).toBeLessThan(10);
	expect(sum).toBe(expectedSum);
});
