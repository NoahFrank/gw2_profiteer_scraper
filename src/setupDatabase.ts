import {API} from './api';
import {ItemDetail} from './DataObjects/ItemDetail';
import {sliceIds} from './batchRequest'
import {deserialize} from 'serializer.ts/Serializer';

import * as fs from 'fs';
import * as mongoose from 'mongoose';

// Logger
import * as log4js from 'log4js'
let log = log4js.getLogger("setupDatabase");

import ItemModel = require("./models/ItemSchema");

let connect = mongoose.connect('mongodb://localhost/gw2-profiteer', {useMongoClient: true});

export function setupDatabase(cb: Function) {
	connect.then( () => { // Wait for connection to database to be established
		ItemModel.count({}, (error, count) => {
			if (error) { // If counting Item documents fails
				log.error(`Failed to count number of Item Documents in database\n${error}`);
			}

			// Load all the tradeable item ids into data variable
			let data: Buffer = null;
			try {
				data = fs.readFileSync('config/itemList.json');
			} catch (error) {
				log.error(`Failed to read config/itemList.json\n${error}`);
			}

			if (count <= 0) { // If the Item Collection isn't already populated
				if (data) { // Make sure we have read the data successfully
					let parsedData = JSON.parse(data.toString());

					let batchedIds: number[][] = sliceIds(parsedData);
					let allRequestPromises: Promise<void>[] = [];

					// Now we attempt to test if all these item ids we got are all tradeable
					for (let idGroup of batchedIds) {
						allRequestPromises.push(API.getItems(idGroup).then(response => {
							if (response.statusCode === 200) {
								let items: ItemDetail[] = deserialize<ItemDetail[]>(ItemDetail, response.body);

								// Save item to the database after parsing into DTO
								for (let item of items) {
									let newItem = new ItemModel({
										id: item.id,
										name: item.name,
										description: item.description,
										chat_link: item.chat_link,
										type: item.type,
										rarity: item.rarity,
										icon: item.icon,
										level: item.level
									});

									newItem.save( (error, newItem) => {
										log.error(`Error saving item to the database\n${error}`);
									});
								}
							} else {
								// STATUS: 206 Partial Content "text": "no such id"
								log.warn(`Got status: ${response.statusCode} | Message: ${response.statusMessage}`);
							}
						})
						.catch(error => {
							log.error(`Failed to complete getItems API request\n${error}`);
						}));
					}

					Promise.all(allRequestPromises).then( () => {
						log.debug("Finished database setup");
						cb(JSON.parse(data.toString())); // Pass back all the parsed tradeable ids
					});
				}
			} else {
				log.info("Database is already populated (with something at least)");
				cb(JSON.parse(data.toString())); // Pass back all the parsed tradeable ids
			}
		});
	}).catch(error => {
		log.error(`Failed to connect to database\n${error}`);
	});
}
