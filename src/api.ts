import * as got from 'got';

export namespace API {
	export function getListings(ids: number[]) {
		return got.get(
			`http://api.guildwars2.com/v2/commerce/listings?ids=${ids.join(',')}`,
			{
				json: true,
				timeout: 15000, // TODO: Create config for timeout and retry amounts and use that instead
				retries: 1,
			}
		);
	}

	export function getPrices(ids: number[]) {
		return got.get(
			`http://api.guildwars2.com/v2/commerce/prices?ids=${ids.join(',')}`,
			{
				json: true,
				timeout: 15000,
				retries: 1,
			}
		);
	}

	export function getItems(ids: number[]) {
		return got.get(`https://api.guildwars2.com/v2/items?ids=${ids.join(',')}`, {
			json: true,
			timeout: 15000,
			retries: 1,
		});
	}
}
