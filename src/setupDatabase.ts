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
	connect.then( () => {
		ItemModel.count({}, (error, count) => {
			if (error) {
				log.error(`Failed to count number of Item Documents in database\n${error}`);
			}

			if (count <= 0) { // If the database isn't already populated
				let data = null;
				try {
					data = fs.readFileSync('config/itemList.json');
				} catch (e) {
					log.error(`Failed to read config/itemList.json\n${e}`);
				}

				if (data) { // make sure we read the data successfully
					let parsedData = JSON.parse(data.toString());

					let batchedIds: number[][] = sliceIds(parsedData);
					let allRequestPromises: Promise<void>[] = [];

					// Now we attempt to test if all these item ids we got are all tradeable
					for (let idGroup of batchedIds) {
						allRequestPromises.push(API.getItems(idGroup).then(response => {
							// BREAKUP DATA INTO 200's AND ASYNC DO CALL
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

									newItem.save().catch( (error) => {
										log.error(`Error saving item to the database\n${error}`);
									});
								}
							} else {
								// STATUS: 206 Partial Content "text": "no such id"
								console.log(`Got status: ${response.statusCode} | Message: ${response.statusMessage}`);
							}
						})
							.catch(error => {
								log.error(`Failed to complete getItems API request\n${error}`);
							}));
					}

					Promise.all(allRequestPromises).then( () => {
						console.log("Finished");
						cb();
					});
				}
			} else {
				log.info("Database is already populated (with something at least)");
			}
		});
	}).catch( (error) => {
		log.error(`Failed to connect to database\n${error}`);
	});
}
