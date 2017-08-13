import * as mongoose from 'mongoose';

let priceSchema = new mongoose.Schema({
	item_id: Number,
	buys: {
		quantity: Number,
		unit_price: Number
	},
	sells: {
		quantity: Number,
		unit_price: Number
	}
}, {timestamps: true});

let PriceModel = mongoose.model('Price', priceSchema);
export = PriceModel;
