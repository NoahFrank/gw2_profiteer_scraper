import * as mongoose from 'mongoose';

let volumeSchema = new mongoose.Schema({
	item_id: Number,
	bought: Number,
	sold: Number,
	lastListing: {
		buys: Number,
		sells: Number
	}
}, {timestamps: true});

let VolumeModel = mongoose.model('Volume', volumeSchema);
export = VolumeModel;
