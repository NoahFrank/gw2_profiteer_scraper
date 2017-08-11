import {API} from "./api";
import {ItemDetail} from "./ItemDetail";
import {deserialize} from "serializer.ts/Serializer";

import * as got from 'got';

export class Scraper {

	numOfNonTradeables: number;

	public run() {
		got.get('https://api.guildwars2.com/v2/commerce/prices', {json: true}).then(response => { // Get all tradeable items?
			const data: number[] = response.body as number[];

			// Now we attempt to test if all these item ids we got are all tradeable
			API.getItems(data).then(response => { // BREAKUP DATA INTO 200's AND ASYNC DO CALL
				if (response.statusCode == 200) {
					const items: ItemDetail[] = deserialize<ItemDetail[]>(ItemDetail, response.body);

					for (let i of items) {
						if (!i.tradeable()) {
							this.numOfNonTradeables++;
						}
					}

					console.log("We found " + this.numOfNonTradeables);
				} else { // STATUS: 206 Partial Content "text": "no such id"
					console.log(`Got status: ${response.statusCode} | Message: ${response.statusMessage}`);
				}
			}).catch(error => {
				console.log(error);
			});
		});
	}
}
