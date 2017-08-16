/**
 * The purpose and utility of logAPIBehavior is to monitor the behavior of the GW2 API.
 * When monitorLoop is run, logAPIBehavior will run recursively forever, collecting data on
 * the given ITEM_IDS.  The data is designed for human review through the log file "log/all-the-logs.log".
 * The item price/quantity and different methods of obtaining these statistics are compared and contrasted.
 *
 * The main use case I developed this code was to determine the approximate update period of the GW2 API of
 * a given item.  In addition, I also used this code to determine the inconsistency between the /listing and /prices
 * API endpoints.  After reviewing the data, I can make an educated decision on which API endpoints to use for
 * maximum accuracy, while being able to minimize the amount of unnecessary API requests.
 */
import {API} from './api';
import {Item} from "./DataObjects/Item";
import {ItemListing} from "./DataObjects/ItemListing";
import {deserialize} from 'serializer.ts/Serializer';

// Init log4js
import * as log4js from 'log4js';
log4js.configure('./config/log4js.json');
let log = log4js.getLogger("logAPIBehavior");

const ITEM_IDS_TO_LOG_BEHAVIOR: number = 19722;

function logAPIBehavior(lastPrice: Item, lastListing: ItemListing): Promise<any> {
	let allPromises: Promise<void>[] = [];

	allPromises.push(API.getPrices([ITEM_IDS_TO_LOG_BEHAVIOR]).then((response: any) => {
		if (response.statusCode === 200) {
			const prices: Item[] = deserialize<Item[]>(Item, response.body);

			const price = prices[0];

			if (!lastPrice) {
				lastPrice = new Item();
				lastPrice = price;
			} else if (price && lastPrice) {
				if (price.buys.quantity != lastPrice.buys.quantity) {
					const delta = price.buys.quantity - lastPrice.buys.quantity;
					log.debug(`Price Item buy quantity changed from ${lastPrice.buys.quantity} to ${price.buys.quantity} with delta: ${delta}`);
				}
				if (price.buys.unit_price != lastPrice.buys.unit_price) {
					const delta = price.buys.unit_price - lastPrice.buys.unit_price;
					log.debug(`Price Item buy price changed from ${lastPrice.buys.unit_price} to ${price.buys.unit_price} with delta: ${delta}`);
				}
				if (price.sells.quantity != lastPrice.sells.quantity) {
					const delta = price.sells.quantity - lastPrice.sells.quantity;
					log.debug(`Price Item sell quantity changed from ${lastPrice.sells.quantity} to ${price.sells.quantity} with delta: ${delta}`);
				}
				if (price.sells.unit_price != lastPrice.sells.unit_price) {
					const delta = price.sells.unit_price - lastPrice.sells.unit_price;
					log.debug(`Price Item sell price changed from ${lastPrice.sells.unit_price} to ${price.sells.unit_price} with delta: ${delta}`);
				}

				// Now set lastPrice to price for next loop
				lastPrice = price;
			} else {
				log.debug(`Price: ${price} or lastPrice: ${lastPrice} was not set`);
			}
		}
	}));

	allPromises.push(API.getListings([ITEM_IDS_TO_LOG_BEHAVIOR]).then((response: any) => {
		if (response.statusCode === 200) {
			const listings: ItemListing[] = deserialize<ItemListing[]>(ItemListing, response.body);

			const listing = listings[0];

			if (!lastListing) {
				lastListing = new ItemListing();
				lastListing = listing;
			} else if (listing && lastListing) {
				if (listing.sumBuys() != lastListing.sumBuys()) {
					const delta = listing.sumBuys() - lastListing.sumBuys();
					log.debug(`Listing buy quantity changed from ${lastListing.sumBuys()} to ${listing.sumBuys()} with delta: ${delta}`);
				}
				if (listing.sumSells() != lastListing.sumSells()) {
					const delta = listing.sumSells() - lastListing.sumSells();
					log.debug(`Listing sell quantity changed from ${lastListing.sumSells()} to ${listing.sumSells()} with delta: ${delta}`);
				}
				if (listing.buys[0].unit_price != lastListing.buys[0].unit_price) {
					const delta = listing.buys[0].unit_price - lastListing.buys[0].unit_price;
					log.debug(`Listing buy unit price changed from ${lastListing.buys[0].unit_price} to ${listing.buys[0].unit_price} with delta: ${delta}`);
				}
				if (listing.sells[0].unit_price != lastListing.sells[0].unit_price) {
					const delta = listing.sells[0].unit_price - lastListing.sells[0].unit_price;
					log.debug(`Listing sell quantity changed from ${lastListing.sells[0].unit_price} to ${listing.sells[0].unit_price} with delta: ${delta}`);
				}

				if (listing.sumBuys() === lastPrice.buys.quantity) {
					log.debug(`Listing buy quantity and lastPrice buy quantity finally equal!`);
				}
				if (listing.sumSells() === lastPrice.sells.quantity) {
					log.debug(`Listing sell quantity and lastPrice sell quantity finally equal!`);
				}
				if (listing.buys[0].unit_price === lastPrice.buys.unit_price) {
					log.debug(`Listing buy and lastPrice buy finally equal!`);
				}
				if (listing.sells[0].unit_price === lastPrice.sells.unit_price) {
					log.debug(`Listing sell and lastPrice sell finally equal!`);
				}

				// Now set lastListing to listing for next loop
				lastListing = listing;
			} else {
				log.debug(`Listing: ${listing} or lastListing: ${lastListing} was not set`);
			}
		}
	}));

	return new Promise((resolve: any, reject: any) => {
		Promise.all(allPromises).then(() => {
			resolve([lastPrice, lastListing]);
		}).catch((error: any) => {
			reject([error, lastPrice, lastListing]);
		})
	});
}

function monitorLoop(lastPrice: Item, lastListing: ItemListing) {
	logAPIBehavior(lastPrice, lastListing).then((stuff) => {
		monitorLoop(stuff[0], stuff[1]);
	}).catch((error) => {
		log.error(error[0]);
		console.log("Something went wrong - Check log");
		monitorLoop(error[1], error[2]);
	})
}

let lastPrice: Item | undefined = undefined;
let lastListing: ItemListing | undefined = undefined;
monitorLoop(lastPrice, lastListing);
