import {API} from './api';
import {Item} from './DataObjects/Item';
import {ItemListing} from './DataObjects/ItemListing';
import VolumeModel = require("./models/VolumeSchema");
import PriceModel = require("./models/PriceSchema");
import {sliceIds} from './batchRequest'
import {deserialize} from 'serializer.ts/Serializer';
import {setupDatabase} from "./setupDatabase";

// Logger
import * as log4js from 'log4js'
let log = log4js.getLogger("scraper");

export class Scraper {

	public run(): Promise<void> {
		console.log("Running scrape");
		let allPromises: Promise<void>[] = [];

		allPromises.push( // TODO: Change so we don't call setupDatabase to load itemList.json every single loop
			setupDatabase().then((parsedIds) => { // Once database setup is done, get down to scraping
				const batchedIds: number[][] = sliceIds(parsedIds);

				for (const idGroup of batchedIds) { // Loop through each batched set of ids
					// Get all current item listings
					allPromises.push(
						API.getListings(idGroup).then(response => {
							if (response.statusCode === 200) {
								const listings: ItemListing[] = deserialize<ItemListing[]>(ItemListing, response.body);
								for (const listing of listings) {

									// Retrieve previous trade volume for this item from TODAY

									// Get dates for today and tomorrow so we can query today's date
									const today: Date = new Date();
									let tomorrow: Date = new Date();
									tomorrow.setDate(today.getDate() + 1);

									// Query for this item with today's date
									VolumeModel.findOne({
										item_id: listing.id,
										created_on: {"$gte": today, "$lt": tomorrow}
									}, (error, volumeRecord: any) => {
										if (error) { // If we can't find any previous record, create the first
											// This could be due to a new day/first time run/or an unknown edge case
											log.debug(`Creating volume record because failed to findOne of ${listing.id} created on ${today.toDateString()}\n${error}`);
											VolumeModel.create({
												item_id: listing.id,
												bought: 0,
												sold: 0,
												lastListing: listing
											}, (error: any) => {
												if (error) log.error(`Failed to create new trade volume\n${error}`);
											});
										} else { // If we have a previous record, add any newly calculated data and save to database

											// Calculate the trade volume differences and store in database
											let boughtDelta: number = volumeRecord.lastListing.sumBuys() - listing.sumBuys();
											let soldDelta: number = volumeRecord.lastListing.sumSells() - listing.sumSells();

											// If below zero set to zero, negatives indicate more buy/sell orders, not trade volume
											boughtDelta = boughtDelta < 0 ? 0 : boughtDelta;
											soldDelta = soldDelta < 0 ? 0 : soldDelta;

											volumeRecord.bought += boughtDelta;
											volumeRecord.sold += soldDelta;
											volumeRecord.lastListing = listing;

											volumeRecord.save( (error: any) => {
												if (error) log.error(`Failed to save new trade volume ${volumeRecord}\n${error}`);
											});
										}
									});
								}
							}
						}).catch(error => {
							log.error(`getListings API request failed\n${error}`);
						})
					);

					// Get all current item prices with datetime
					allPromises.push(
						API.getPrices(idGroup).then(response => {
							if (response.statusCode === 200) {
								const prices: Item[] = deserialize<Item[]>(Item, response.body);
								for (const price of prices) {
									let newPrice = new PriceModel({
										item_id: price.id,
										buys: price.buys,
										sells: price.sells
									});

									newPrice.save(error => {
										if (error) log.error(`Failed to save new price\n${error}`);
									});
								}
							}
						}).catch(error => {
							log.error(`getPrice API request failed\n${error}`);
						})
					);
				}
			}).catch(error => {
				log.error(error);
			})
		);

		console.log("returning promise now");
		return new Promise( (resolve, reject) => {
			Promise.all(allPromises).then(() => {
				log.debug("Completed a scrape cycle");
				resolve();
			}).catch(error => {
				reject(`Encountered error while waiting for all scrape promises\n${error}`);
			});
		});
	}
}
