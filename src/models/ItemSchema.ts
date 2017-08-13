import * as mongoose from 'mongoose';

let itemSchema = new mongoose.Schema({
	id: Number,
	name: String,
	description: String,
	chat_link: String,
	type: String,
	rarity: String,
	icon: String,
	level: Number,
});

let ItemModel = mongoose.model('Item', itemSchema);
export = ItemModel;
