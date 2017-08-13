import {API} from './api';
import {ItemDetail} from './DataObjects/ItemDetail';
import {sliceIds} from './batchRequest'
import {deserialize} from 'serializer.ts/Serializer';
import {setupDatabase} from "./setupDatabase";

import * as fs from 'fs';
import * as got from 'got';

// Logger
import * as log4js from 'log4js'
let log = log4js.getLogger("scraper");

export class Scraper {
	itemList: ItemDetail[] = [];

	public run() {
		setupDatabase( () => {});
	}
}
