import * as mongoose from 'mongoose';
import {ItemListing} from "../DataObjects/ItemListing";

let volumeSchema = new mongoose.Schema({
	item_id: Number,
	bought: Number,
	sold: Number,
	lastListing: ItemListing
}, {timestamps: true});

let VolumeModel = mongoose.model('Volume', volumeSchema);
export = VolumeModel;
