import {API} from './api';
import {Item} from './DataObjects/Item';
import {ItemListing} from './DataObjects/ItemListing';
import ListingModel = require("./models/ListingSchema");
import PriceModel = require("./models/PriceSchema");
import {sliceIds} from './batchRequest'
import {deserialize} from 'serializer.ts/Serializer';
import {setupDatabase} from "./setupDatabase";

// Logger
import * as log4js from 'log4js'
let log = log4js.getLogger("scraper");

export class Scraper {

	public run() {
		setupDatabase((parsedIds: number[]) => { // Once database setup is done, get down to scraping
			let batchedIds: number[][] = sliceIds(parsedIds);
			let allRequestPromises: Promise<void>[] = [];

			for (let idGroup of batchedIds) { // Loop through each batched set of ids

				// Get all current item listings
				allRequestPromises.push(
					API.getListings(idGroup).then(response => {
						if (response.statusCode === 200) {
							let listings: ItemListing[] = deserialize<ItemListing[]>(ItemListing, response.body);
							for (let listing of listings) {
								let newListing = new ListingModel({
									item_id: listing.id,
									buys: listing.buys,
									sells: listing.sells
								});

								newListing.save().catch(error => {
									log.error(`Failed to save new listing\n${error}`);
								});
							}
						}
					}).catch(error => {
						log.error(`getListings API request failed\n${error}`);
					})
				);

				// Get all current item prices with datetime
				allRequestPromises.push(
					API.getPrices(idGroup).then(response => {
						if (response.statusCode === 200) {
							let prices: Item[] = deserialize<Item[]>(Item, response.body);
							for (let price of prices) {
								let newPrice = new PriceModel({
									item_id: price.id,
									buys: price.buys,
									sells: price.sells
								});

								newPrice.save().catch(error => {
									log.error(`Failed to save new price\n${error}`);
								});
							}
						}
					}).catch(error => {
						log.error(`getPrice API request failed\n${error}`);
					})
				);
			}

			Promise.all(allRequestPromises).then( () => {
				console.log("FINISHED SCRAPING");
				log.info("Scrape complete");
			})
		});
	}
}
