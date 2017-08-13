import * as mongoose from 'mongoose';

let listingSchema = new mongoose.Schema({
	item_id: Number,
	buys: [{
		listings: Number,
		quantity: Number,
		unit_price: Number
	}],
	sells: [{
		listings: Number,
		quantity: Number,
		unit_price: Number
	}]
}, {timestamps: true});

let ListingModel = mongoose.model('Listing', listingSchema);
export = ListingModel;
