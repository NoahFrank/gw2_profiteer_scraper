import * as fs from 'fs';

import * as got from 'got';

// Logger
import * as log4js from 'log4js'
let log = log4js.getLogger("storeItemList");

export function storeItemList(): void {
	got.get('https://api.guildwars2.com/v2/commerce/prices', {json: true})
		.then(response => {
			if (response.statusCode == 200) {
				// Get all tradeable items
				const data: number[] = response.body as number[];
				fs.writeFileSync('config/itemList.json', JSON.stringify(data), (error: any) => {
					error ? log.error(`Failed to write itemList.json\n${error}`) :
							log.debug("Finished writing itemList.json");
				});
			} else {
				log.warn(`Failed to get 200 statusCode\nStatus Code: ${response.statusCode}\nStatus Message: ${response.statusMessage}`);
			}
		})
		.catch(error => {
			log.error(`Failed to request all item ids\n${error}`);
		});
}
