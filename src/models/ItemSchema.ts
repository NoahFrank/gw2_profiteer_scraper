import * as mongoose from 'mongoose';
let Schema = mongoose.Schema;

let itemSchema = new Schema({
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
