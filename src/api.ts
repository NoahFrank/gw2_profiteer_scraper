const got = require("got");

export class API {

	 getListings(ids: number[]) {
		return got.get(`http://api.guildwars2.com/v2/commerce/listings?ids=${ids.join(',')}`, {
			json: true,
			timeout: 15000, // TODO: Create config for timeout and retry amounts and use that instead
			retries: 1
		});
	 }

	 getPrices(ids: number[]) {
		 return got.get(`http://api.guildwars2.com/v2/commerce/prices?ids=${ids.join(',')}`, {
			 json: true,
			 timeout: 15000,
			 retries: 1
		 });
	 }
}
