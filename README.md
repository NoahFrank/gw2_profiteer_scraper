[![Build Status](https://travis-ci.org/{{github-user-name}}/{{github-app-name}}.svg?branch=master)](https://travis-ci.org/{{github-user-name}}/{{github-app-name}}.svg?branch=master)
[![Coverage Status](https://coveralls.io/repos/github/{{github-user-name}}/{{github-app-name}}/badge.svg?branch=master)](https://coveralls.io/github/{{github-user-name}}/{{github-app-name}}?branch=master)
[![MIT license](http://img.shields.io/badge/license-MIT-brightgreen.svg)](http://opensource.org/licenses/MIT)

# Guild Wars 2 Profiteer Scraper
This scraping program's purpose is to collect data on price and volume
trends of in-game items.  This data is intended to be navigated and analyzed
in a sister project ([GW2Profiteer]() TODO LINK).

## Getting Started
1. Clone the repo
2. Run `npm install`
3. You can either:
    1. Create your own itemList
        - To make your own, create a file named `itemList.json` inside `{project_root}/config/`
        - Inside itemList.json create a comma-separated arraylist of item ids
          that you would like to be scraped
          > Example:
          > ```json
          > [431, 4522, 8654, 3245]
          > ```
    2. Let the program download all item ids
        - Simply do not create a `config/itemList.json` or leave it blank
4. Start mongoDB and create new database named exactly `gw2-profiteer`
5. Start scraping all item data from itemList.json into the mongo database
with `npm start`
