export * from './scraper';
import {Scraper} from './scraper';
const Promise = require('bluebird');

// Init log4js
import * as log4js from 'log4js';
log4js.configure('./config/log4js.json');
let log = log4js.getLogger("index");

// TODO: Check if itemList.json is populated, if not call storeItemList()

const scrap = new Scraper();

scrap.run();
