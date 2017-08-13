export * from './scraper';

import {Scraper} from './scraper';

// Init log4js
import * as log4js from 'log4js';
log4js.configure('./config/log4js.json');
let log = log4js.getLogger("index");

const scrap = new Scraper();

scrap.run();
