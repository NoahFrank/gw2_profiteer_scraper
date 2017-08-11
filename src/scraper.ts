import { API } from "./api";
import { Item } from "./Item";

export class Scraper {
	private greeting: string;

	constructor(message: string) {
		this.greeting = message;
	}

	public greet() {
		API.getPrices([19684, 19709]).then(response => {
			if (response.statusCode == 200) {
				const items: Item[] = response.body as Item[];
				console.log(items[1].buys.quantity)
			}
		}).catch(error => {
			console.log(typeof error);
		});
		return `Bonjour, ${this.greeting}!`;
	}
}
